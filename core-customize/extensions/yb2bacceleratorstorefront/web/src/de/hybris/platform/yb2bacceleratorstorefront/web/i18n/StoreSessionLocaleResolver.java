/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.i18n;

import de.hybris.platform.servicelayer.i18n.I18NService;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.SessionLocaleResolver;


/**
 * Implementation of {@link SessionLocaleResolver} which falls back to the locale defined by the current site
 */
public class StoreSessionLocaleResolver implements LocaleResolver
{
	public static final String LOCALE_REQUEST_ATTRIBUTE_NAME = StoreSessionLocaleResolver.class.getName() + ".LOCALE";

	private I18NService i18NService;

	protected I18NService getI18NService()
	{
		return i18NService;
	}

	@Required
	public void setI18NService(final I18NService i18NService)
	{
		this.i18NService = i18NService;
	}

	@Override
	public Locale resolveLocale(final HttpServletRequest request)
	{
		// Lookup the cached locale in the request
		Locale locale = (Locale) request.getAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME);

		if (locale == null)
		{
			// Get the locale from the hybris session
			locale = getHybrisSessionLocale();

			// Cache the locale in the request attributes
			if (locale != null)
			{
				request.setAttribute(LOCALE_REQUEST_ATTRIBUTE_NAME, locale);
			}
		}

		return locale;
	}

	@Override
	public void setLocale(final HttpServletRequest request, final HttpServletResponse response, final Locale locale)
	{
		// Ignore setting the locale as it must be changed only via the hybris session
	}

	protected Locale getHybrisSessionLocale()
	{
		return getI18NService().getCurrentLocale();
	}
}
