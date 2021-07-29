/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.evaluator.impl;

import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.order.CartService;
import de.hybris.platform.servicelayer.session.SessionService;
import de.hybris.platform.servicelayer.user.UserService;
import de.hybris.platform.yb2bacceleratorstorefront.security.evaluator.SecurityTraitEvaluator;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.util.CookieGenerator;


public class RequireHardLoginEvaluator implements SecurityTraitEvaluator
{
	private static final Logger LOG = Logger.getLogger(RequireHardLoginEvaluator.class);

	public static final String SECURE_GUID_SESSION_KEY = "acceleratorSecureGUID";

	private CookieGenerator cookieGenerator;
	private UserService userService;
	private SessionService sessionService;
	private CartService cartService;

	protected CookieGenerator getCookieGenerator()
	{
		return cookieGenerator;
	}

	@Required
	public void setCookieGenerator(final CookieGenerator cookieGenerator)
	{
		this.cookieGenerator = cookieGenerator;
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

	protected SessionService getSessionService()
	{
		return sessionService;
	}

	@Required
	public void setSessionService(final SessionService sessionService)
	{
		this.sessionService = sessionService;
	}

	protected CartService getCartService()
	{
		return cartService;
	}

	@Required
	public void setCartService(final CartService cartService)
	{
		this.cartService = cartService;
	}

	@Override
	public boolean evaluate(final HttpServletRequest request, final HttpServletResponse response)
	{
		final String guid = (String) request.getSession().getAttribute(SECURE_GUID_SESSION_KEY);
		boolean result = true;

		if ((!getUserService().isAnonymousUser(getUserService().getCurrentUser()) || checkForAnonymousCheckout())
				&& checkForGUIDCookie(request, response, guid))
		{
			result = false;
		}

		if (result)
		{
			LOG.warn((guid == null ? "missing secure token in session" : "no matching guid cookie") + ", login required");
		}

		return result;
	}

	protected boolean checkForGUIDCookie(final HttpServletRequest request, final HttpServletResponse response, final String guid)
	{
		if (guid != null && request.getCookies() != null)
		{
			final String guidCookieName = getCookieGenerator().getCookieName();
			if (guidCookieName != null)
			{
				return isGuidStoredinCookies(request, response, guid, guidCookieName);
			}
		}

		return false;
	}

	protected boolean isGuidStoredinCookies(final HttpServletRequest request, final HttpServletResponse response,
			final String guid, final String guidCookieName)
	{
		for (final Cookie cookie : request.getCookies())
		{
			if (guidCookieName.equals(cookie.getName()))
			{
				if (guid.equals(cookie.getValue()))
				{
					return true;
				}
				else
				{
					LOG.info("Found secure cookie with invalid value. expected [" + guid + "] actual [" + cookie.getValue()
							+ "]. removing.");
					getCookieGenerator().removeCookie(response);
				}
			}
		}

		return false;
	}

	protected boolean checkForAnonymousCheckout()
	{
		if (Boolean.TRUE.equals(getSessionService().getAttribute(WebConstants.ANONYMOUS_CHECKOUT)))
		{
			if (getSessionService().getAttribute(WebConstants.ANONYMOUS_CHECKOUT_GUID) == null)
			{
				getSessionService().setAttribute(WebConstants.ANONYMOUS_CHECKOUT_GUID,
						StringUtils.substringBefore(getCartService().getSessionCart().getUser().getUid(), "|"));
			}
			return true;
		}

		return false;
	}
}
