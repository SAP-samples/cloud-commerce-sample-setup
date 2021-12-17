/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security;

import de.hybris.platform.acceleratorservices.urlencoder.UrlEncoderService;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commercefacades.customer.CustomerFacade;
import de.hybris.platform.commercefacades.storesession.StoreSessionFacade;
import de.hybris.platform.commerceservices.security.SecureTokenService;
import de.hybris.platform.commerceservices.strategies.CheckoutCustomerStrategy;
import de.hybris.platform.servicelayer.i18n.CommonI18NService;
import de.hybris.platform.servicelayer.user.UserService;
import de.hybris.platform.yb2bacceleratorstorefront.web.wrappers.RemoveEncodingHttpServletRequestWrapper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.authentication.RememberMeAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;


public class AcceleratorRememberMeServices extends TokenBasedRememberMeServices
{
	private UserService userService;
	private CustomerFacade customerFacade;
	private CheckoutCustomerStrategy checkoutCustomerStrategy;
	private StoreSessionFacade storeSessionFacade;
	private CommonI18NService commonI18NService;
	private UrlEncoderService urlEncoderService;
	private SecureTokenService secureTokenService;


	public AcceleratorRememberMeServices(final String key, final UserDetailsService userDetailsService)
	{
		super(key, userDetailsService);
	}

	@Override
	protected void setCookie(final String[] tokens, final int maxAge, final HttpServletRequest request,
	                         final HttpServletResponse response)
	{
		if (!getCheckoutCustomerStrategy().isAnonymousCheckout())
		{
			super.setCookie(tokens, maxAge, new RemoveEncodingHttpServletRequestWrapper(request, getUrlEncodingPattern(request)),
					response);
		}
	}

	@Override
	public void logout(final HttpServletRequest request, final HttpServletResponse response, final Authentication authentication)
	{
		super.logout(new RemoveEncodingHttpServletRequestWrapper(request, getUrlEncodingPattern(request)), response, authentication);
	}

	@Override
	protected Authentication createSuccessfulAuthentication(final HttpServletRequest request, final UserDetails user)
	{
		getUserService().setCurrentUser(getUserService().getUserForUID(user.getUsername()));

		if (StringUtils.isNotEmpty(getUrlEncoderService().getUrlEncodingPattern()))
		{
			getCustomerFacade().rememberMeLoginSuccessWithUrlEncoding(getUrlEncoderService().isLanguageEncodingEnabled(),
					getUrlEncoderService().isCurrencyEncodingEnabled());
		}
		else
		{
			getCustomerFacade().loginSuccess();
		}
		final RememberMeAuthenticationToken auth = new RememberMeAuthenticationToken(getKey(), user, user.getAuthorities());
		auth.setDetails(getAuthenticationDetailsSource().buildDetails(request));
		return auth;
	}

	@Override
	protected String retrievePassword(final Authentication authentication)
	{
		return getUserService().getUserForUID(authentication.getPrincipal().toString()).getEncodedPassword();
	}

	protected String getUrlEncodingPattern(final HttpServletRequest request)
	{
		final String encodingAttributes = (String) request.getAttribute(WebConstants.URL_ENCODING_ATTRIBUTES);
		return StringUtils.defaultString(encodingAttributes);
	}

	protected UserService getUserService()
	{
		return userService;
	}

	@Required
	public void setUserService(final UserService userService)
	{
		this.userService = userService;
	}

	protected CustomerFacade getCustomerFacade()
	{
		return customerFacade;
	}

	@Required
	public void setCustomerFacade(final CustomerFacade customerFacade)
	{
		this.customerFacade = customerFacade;
	}

	protected CheckoutCustomerStrategy getCheckoutCustomerStrategy()
	{
		return checkoutCustomerStrategy;
	}

	@Required
	public void setCheckoutCustomerStrategy(final CheckoutCustomerStrategy checkoutCustomerStrategy)
	{
		this.checkoutCustomerStrategy = checkoutCustomerStrategy;
	}

	protected UrlEncoderService getUrlEncoderService()
	{
		return urlEncoderService;
	}

	@Required
	public void setUrlEncoderService(final UrlEncoderService urlEncoderService)
	{
		this.urlEncoderService = urlEncoderService;
	}


	protected StoreSessionFacade getStoreSessionFacade()
	{
		return storeSessionFacade;
	}

	@Required
	public void setStoreSessionFacade(final StoreSessionFacade storeSessionFacade)
	{
		this.storeSessionFacade = storeSessionFacade;
	}

	protected CommonI18NService getCommonI18NService()
	{
		return commonI18NService;
	}

	@Required
	public void setCommonI18NService(final CommonI18NService commonI18NService)
	{
		this.commonI18NService = commonI18NService;
	}

	protected SecureTokenService getSecureTokenService()
	{
		return secureTokenService;
	}

	@Required
	public void setSecureTokenService(final SecureTokenService secureTokenService)
	{
		this.secureTokenService = secureTokenService;
	}
}
