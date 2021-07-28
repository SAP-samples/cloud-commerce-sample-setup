/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.yb2bacceleratorstorefront.security.cookie.CookieNotificationCookieGenerator;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.WebUtils;


/**
 * This class is responsible to decide if the cookie notification should be displayed.
 *
 */
public class CookieNotificationBeforeViewHandler implements BeforeViewHandler
{
	private static final Logger LOG = Logger.getLogger(CookieNotificationBeforeViewHandler.class);
	private static final String IS_COOKIE_NOTIFICATION_ACCEPTED = "isCookieNotificationAccepted";
	private static final String NOT_ACCEPTED = "NOT_ACCEPTED";
	private static final String ACCEPTED = "ACCEPTED";

	private CookieNotificationCookieGenerator cookieNotificationCookieGenerator;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
			throws Exception
	{
		final Cookie cookieNotification = WebUtils.getCookie(request, getCookieNotificationCookieGenerator().getCookieName());

		// add cookie if it's not created yet
		if (cookieNotification == null)
		{
			if (LOG.isDebugEnabled())
			{
				LOG.debug("Adding cookie notification to the cookies.");
			}
			getCookieNotificationCookieGenerator().addCookie(response, NOT_ACCEPTED);
			modelAndView.addObject(IS_COOKIE_NOTIFICATION_ACCEPTED, Boolean.FALSE);
			return;
		}

		// update according to the cookie value
		modelAndView.addObject(IS_COOKIE_NOTIFICATION_ACCEPTED,
				ACCEPTED.equalsIgnoreCase(cookieNotification.getValue()) ? Boolean.TRUE : Boolean.FALSE);
	}

	protected CookieNotificationCookieGenerator getCookieNotificationCookieGenerator()
	{
		return cookieNotificationCookieGenerator;
	}

	@Required
	public void setCookieNotificationCookieGenerator(final CookieNotificationCookieGenerator cookieNotificationCookieGenerator)
	{
		this.cookieNotificationCookieGenerator = cookieNotificationCookieGenerator;
	}
}
