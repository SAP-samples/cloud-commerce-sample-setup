/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.theme;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import de.hybris.platform.yb2bacceleratorstorefront.util.SiteThemeResolverUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.theme.AbstractThemeResolver;


/**
 * Resolve the spring theme name from the CMSSite. The spring theme name is built from the CMSSite UID and the CMSSite
 * Theme.
 */
public class UiExperienceSiteThemeResolver extends AbstractThemeResolver
{
	public static final String THEME_REQUEST_ATTRIBUTE_NAME = UiExperienceSiteThemeResolver.class.getName() + ".THEME";
	private SiteThemeResolverUtils siteThemeResolverUtils;

	@Override
	public String resolveThemeName(final HttpServletRequest request)
	{
		// Lookup the cached theme name in the request
		String themeName = (String) request.getAttribute(THEME_REQUEST_ATTRIBUTE_NAME);

		if (themeName == null)
		{
			// Resolve Theme from CMSSiteService
			themeName = getSiteThemeResolverUtils().resolveThemeForCurrentSite();

			// Cache the theme in the request attributes
			if (themeName != null)
			{
				request.setAttribute(THEME_REQUEST_ATTRIBUTE_NAME, themeName);
			}
		}

		return themeName;
	}

	@Override
	public String getDefaultThemeName()
	{
		return siteThemeResolverUtils.getDefaultTheme();
	}

	@Override
	public void setThemeName(final HttpServletRequest arg0, final HttpServletResponse arg1, final String arg2)
	{
		throw new UnsupportedOperationException("Cannot change theme - use a different theme resolution strategy");
	}

	protected SiteThemeResolverUtils getSiteThemeResolverUtils()
	{
		return siteThemeResolverUtils;
	}

	@Required
	public void setSiteThemeResolverUtils(SiteThemeResolverUtils siteThemeResolverUtils)
	{
		this.siteThemeResolverUtils = siteThemeResolverUtils;
	}
}
