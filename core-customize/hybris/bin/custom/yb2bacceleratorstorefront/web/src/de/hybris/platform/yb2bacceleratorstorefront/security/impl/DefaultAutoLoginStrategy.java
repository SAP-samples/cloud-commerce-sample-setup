/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import de.hybris.platform.acceleratorstorefrontcommons.security.AutoLoginStrategy;
import de.hybris.platform.acceleratorstorefrontcommons.security.GUIDCookieStrategy;
import de.hybris.platform.commercefacades.customer.CustomerFacade;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.WebAuthenticationDetails;


/**
 * Default implementation of {@link AutoLoginStrategy}
 */
public class DefaultAutoLoginStrategy implements AutoLoginStrategy
{
	private static final Logger LOG = Logger.getLogger(DefaultAutoLoginStrategy.class);

	private AuthenticationManager authenticationManager;
	private CustomerFacade customerFacade;
	private GUIDCookieStrategy guidCookieStrategy;
	private RememberMeServices rememberMeServices;

	@Override
	public void login(final String username, final String password, final HttpServletRequest request,
			final HttpServletResponse response)
	{
		final UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
		token.setDetails(new WebAuthenticationDetails(request));
		try
		{
			final Authentication authentication = getAuthenticationManager().authenticate(token);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			getCustomerFacade().loginSuccess();
			getGuidCookieStrategy().setCookie(request, response);
			getRememberMeServices().loginSuccess(request, response, token);
		}
		catch (final Exception e)
		{
			SecurityContextHolder.getContext().setAuthentication(null);
			LOG.error("Failure during autoLogin", e);
		}
	}

	protected AuthenticationManager getAuthenticationManager()
	{
		return authenticationManager;
	}

	@Required
	public void setAuthenticationManager(final AuthenticationManager authenticationManager)
	{
		this.authenticationManager = authenticationManager;
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

	protected GUIDCookieStrategy getGuidCookieStrategy()
	{
		return guidCookieStrategy;
	}

	@Required
	public void setGuidCookieStrategy(final GUIDCookieStrategy guidCookieStrategy)
	{
		this.guidCookieStrategy = guidCookieStrategy;
	}

	protected RememberMeServices getRememberMeServices()
	{
		return rememberMeServices;
	}

	@Required
	public void setRememberMeServices(final RememberMeServices rememberMeServices)
	{
		this.rememberMeServices = rememberMeServices;
	}
}
