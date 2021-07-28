/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.util;

import de.hybris.platform.acceleratorservices.addonsupport.RequiredAddOnsNameProvider;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorservices.uiexperience.UiExperienceService;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.commerceservices.enums.SiteTheme;
import de.hybris.platform.yb2bacceleratorstorefront.web.view.UiExperienceViewResolver;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;


/**
 * Various utility methods for getting UI resource paths and theme information from the current site / experience.
 */
public class UiThemeUtils
{
	protected static final String RESOURCE_TYPE_JAVASCRIPT = "javascript";
	protected static final String RESOURCE_TYPE_CSS = "css";
	protected static final String PATHS = ".paths.";
	protected static final String SMARTEDITADDON = "smarteditaddon";

	private CMSSiteService cmsSiteService;
	private RequiredAddOnsNameProvider requiredAddOnsNameProvider;
	private SiteConfigService siteConfigService;
	private UiExperienceService uiExperienceService;
	private UiExperienceViewResolver uiExperienceViewResolver;
	private String defaultThemeName;

	public List getAddOnCommonCSSPaths(final HttpServletRequest request)
	{
		final List<String> addOnNames = requiredAddOnsNameProvider.getAddOns(request.getServletContext().getServletContextName());
		return getAddOnResourcePaths(getContextPathFromRequest(request), addOnNames,  getCssPropertyNames());
	}

	public List getSmartEditAddOnCSSPaths(final HttpServletRequest request)
	{
		final Optional<String> smartEditAddOn = getSmartEditAddOn(request);
		if (smartEditAddOn.isPresent())
		{
			return getAddOnResourcePaths(getContextPathFromRequest(request), Arrays.asList(smartEditAddOn.get()), getCssPropertyNames());
		}
		return Collections.emptyList();
	}

	public List getAddOnThemeCSSPaths(final HttpServletRequest request)
	{
		final String[] propertyNames = new String[]
		{ RESOURCE_TYPE_CSS + PATHS + getUiExperience() + "." + getThemeNameForCurrentSite() };

		return getAddOnResourcePaths(getContextPathFromRequest(request),
				requiredAddOnsNameProvider.getAddOns(request.getServletContext().getServletContextName()), propertyNames);
	}

	public List getSmartEditAddOnJSPaths(final HttpServletRequest request)
	{
		final Optional<String> smartEditAddOn = getSmartEditAddOn(request);
		if (smartEditAddOn.isPresent())
		{
			return getAddOnResourcePaths(getContextPathFromRequest(request), Arrays.asList(smartEditAddOn.get()), getJsPropertyNames());
		}
		return Collections.emptyList();
	}

	public List getAddOnJSPaths(final HttpServletRequest request)
	{
		return getAddOnResourcePaths(getContextPathFromRequest(request),
				requiredAddOnsNameProvider.getAddOns(request.getServletContext().getServletContextName()), getJsPropertyNames());
	}

	public String getThemeNameForCurrentSite()
	{
		final CMSSiteModel site = cmsSiteService.getCurrentSite();
		final SiteTheme theme = site.getTheme();
		if (theme != null)
		{
			final String themeCode = theme.getCode();
			if (themeCode != null && !themeCode.isEmpty())
			{
				return themeCode;
			}
		}
		return getDefaultThemeName();
	}

	public String getUiExperience()
	{
		return uiExperienceViewResolver.getUiExperienceViewPrefix().isEmpty()
				? uiExperienceService.getUiExperienceLevel().getCode().toLowerCase()
				: StringUtils.remove(
						uiExperienceViewResolver.getUiExperienceViewPrefix().get(uiExperienceService.getUiExperienceLevel()), "/");
	}

	public String getContextPathFromRequest(final HttpServletRequest request)
	{
		final Object urlEncodingAttributes = request.getAttribute(WebConstants.URL_ENCODING_ATTRIBUTES);
		return StringUtils.remove(request.getContextPath(), urlEncodingAttributes != null ? urlEncodingAttributes.toString() : "");
	}

	protected List getAddOnResourcePaths(final String contextPath, final List<String> addOnNames, final String[] propertyNames)
	{
		final List<String> addOnResourcePaths = new ArrayList<String>();

		for (final String addon : addOnNames)
		{
			for (final String propertyName : propertyNames)
			{
				addAddOnResourcePaths(contextPath, addOnResourcePaths, addon, propertyName);
			}
		}
		return addOnResourcePaths;
	}

	protected void addAddOnResourcePaths(final String contextPath, final List<String> addOnResourcePaths, final String addon,
			final String propertyName)
	{
		final String addOnResourcePropertyValue = siteConfigService.getProperty(addon + "." + propertyName);
		if (addOnResourcePropertyValue != null)
		{
			final String[] propertyPaths = addOnResourcePropertyValue.split(";");
			for (final String propertyPath : propertyPaths)
			{
				addOnResourcePaths.add(contextPath + "/_ui/addons/" + addon + propertyPath);
			}
		}
	}

	protected String[] getCssPropertyNames()
	{
		return new String[]
				{ RESOURCE_TYPE_CSS + ".paths", //
						RESOURCE_TYPE_CSS + PATHS + getUiExperience() //
				};
	}

	protected String[] getJsPropertyNames()
	{
		return new String[]
			{ RESOURCE_TYPE_JAVASCRIPT + ".paths", //
					RESOURCE_TYPE_JAVASCRIPT + PATHS + getUiExperience() //
			};
	}

	protected Optional<String> getSmartEditAddOn(final HttpServletRequest request)
	{
		return requiredAddOnsNameProvider.getAddOns(request.getServletContext().getServletContextName())
				.stream()
				.filter(addOnName -> addOnName.equals(SMARTEDITADDON))
				.findFirst();
	}

	protected String getDefaultThemeName()
	{
		return defaultThemeName;
	}

	@Required
	public void setDefaultThemeName(final String defaultThemeName)
	{
		this.defaultThemeName = defaultThemeName;
	}

	protected CMSSiteService getCmsSiteService()
	{
		return cmsSiteService;
	}

	@Required
	public void setCmsSiteService(final CMSSiteService cmsSiteService)
	{
		this.cmsSiteService = cmsSiteService;
	}

	protected RequiredAddOnsNameProvider getRequiredAddOnsNameProvider()
	{
		return requiredAddOnsNameProvider;
	}

	@Required
	public void setRequiredAddOnsNameProvider(final RequiredAddOnsNameProvider requiredAddOnsNameProvider)
	{
		this.requiredAddOnsNameProvider = requiredAddOnsNameProvider;
	}

	protected SiteConfigService getSiteConfigService()
	{
		return siteConfigService;
	}

	@Required
	public void setSiteConfigService(final SiteConfigService siteConfigService)
	{
		this.siteConfigService = siteConfigService;
	}

	protected UiExperienceService getUiExperienceService()
	{
		return uiExperienceService;
	}

	@Required
	public void setUiExperienceService(final UiExperienceService uiExperienceService)
	{
		this.uiExperienceService = uiExperienceService;
	}

	protected UiExperienceViewResolver getUiExperienceViewResolver()
	{
		return uiExperienceViewResolver;
	}

	@Required
	public void setUiExperienceViewResolver(final UiExperienceViewResolver uiExperienceViewResolver)
	{
		this.uiExperienceViewResolver = uiExperienceViewResolver;
	}
}
