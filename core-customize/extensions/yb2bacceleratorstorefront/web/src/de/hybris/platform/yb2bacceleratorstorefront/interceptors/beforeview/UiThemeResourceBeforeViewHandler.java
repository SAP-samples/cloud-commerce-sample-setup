/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorfacades.device.DeviceDetectionFacade;
import de.hybris.platform.acceleratorfacades.device.data.DeviceData;
import de.hybris.platform.acceleratorservices.uiexperience.UiExperienceService;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.commerceservices.enums.UiExperienceLevel;
import de.hybris.platform.commerceservices.i18n.CommerceCommonI18NService;
import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.yb2bacceleratorstorefront.util.UiThemeUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.ModelAndView;


/**
 * Interceptor to setup the paths to the UI resource paths in the model before passing it to the view. Sets up the path
 * to the web accessible UI resources for the following: * The current site * The current theme * The common resources
 * All of these paths are qualified by the current UiExperienceLevel
 */
public class UiThemeResourceBeforeViewHandler implements BeforeViewHandler
{
	@SuppressWarnings("unused")
	private static final Logger LOG = Logger.getLogger(UiThemeResourceBeforeViewHandler.class);

	protected static final String COMMON = "common";
	protected static final String SHARED = "shared";

	@Resource(name = "cmsSiteService")
	private CMSSiteService cmsSiteService;

	@Resource(name = "deviceDetectionFacade")
	private DeviceDetectionFacade deviceDetectionFacade;

	@Resource(name = "commerceCommonI18NService")
	private CommerceCommonI18NService commerceCommonI18NService;

	@Resource(name = "uiThemeUtils")
	private UiThemeUtils uiThemeUtils;

	@Resource(name = "uiExperienceService")
	private UiExperienceService uiExperienceService;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
	{
		final CMSSiteModel currentSite = cmsSiteService.getCurrentSite();

		final String siteName = currentSite.getUid();
		final String themeName = uiThemeUtils.getThemeNameForCurrentSite();
		final String uiExperienceCode = uiExperienceService.getUiExperienceLevel().getCode();
		final String uiExperienceCodeLower = uiThemeUtils.getUiExperience();

		final String contextPath = uiThemeUtils.getContextPathFromRequest(request);

		final String siteRootUrl = contextPath + "/_ui/" + uiExperienceCodeLower;
		final String sharedResourcePath = contextPath + "/_ui/" + SHARED;
		final String siteResourcePath = siteRootUrl + "/site-" + siteName;
		final String themeResourcePath = siteRootUrl + "/theme-" + themeName;
		final String commonResourcePath = siteRootUrl + "/" + COMMON;
		final String encodedContextPath = request.getContextPath();
		final LanguageModel currentLanguage = commerceCommonI18NService.getCurrentLanguage();

		modelAndView.addObject("contextPath", contextPath);
		modelAndView.addObject("sharedResourcePath", sharedResourcePath);
		modelAndView.addObject("siteResourcePath", siteResourcePath);
		modelAndView.addObject("themeResourcePath", themeResourcePath);
		modelAndView.addObject("commonResourcePath", commonResourcePath);
		modelAndView.addObject("encodedContextPath", encodedContextPath);
		modelAndView.addObject("siteRootUrl", siteRootUrl);
		modelAndView.addObject("language", currentLanguage != null ? currentLanguage.getIsocode() : "en");
		modelAndView.addObject("themeName", themeName);
		modelAndView.addObject("uiExperienceLevel", uiExperienceCode);

		final String detectedUiExperienceCode = uiExperienceService.getDetectedUiExperienceLevel().getCode();
		modelAndView.addObject("detectedUiExperienceCode", detectedUiExperienceCode);

		final UiExperienceLevel overrideUiExperienceLevel = uiExperienceService.getOverrideUiExperienceLevel();
		if (overrideUiExperienceLevel == null)
		{
			modelAndView.addObject("uiExperienceOverride", Boolean.FALSE);
		}
		else
		{
			modelAndView.addObject("uiExperienceOverride", Boolean.TRUE);
			modelAndView.addObject("overrideUiExperienceCode", overrideUiExperienceLevel.getCode());
		}

		final DeviceData currentDetectedDevice = deviceDetectionFacade.getCurrentDetectedDevice();
		modelAndView.addObject("detectedDevice", currentDetectedDevice);

		modelAndView.addObject("addOnCommonCssPaths", uiThemeUtils.getAddOnCommonCSSPaths(request));
		modelAndView.addObject("addOnThemeCssPaths", uiThemeUtils.getAddOnThemeCSSPaths(request));
		modelAndView.addObject("addOnJavaScriptPaths", uiThemeUtils.getAddOnJSPaths(request));
	}
}
