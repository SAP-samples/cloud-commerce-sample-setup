/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.misc;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.cms2.misc.UrlUtils;
import de.hybris.platform.servicelayer.i18n.I18NService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.context.Theme;
import org.springframework.ui.context.ThemeSource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ThemeResolver;


/**
 * Controller for evil clients that go for the favicon.ico directly in the root, redirect them to the real location
 */
@Controller
public class FavIconController extends AbstractController
{
	private static final Logger LOGGER = LoggerFactory.getLogger(FavIconController.class);

	private static final String FAVICON_THEME_CODE = "img.favIcon";
	private static final String ORIGINAL_CONTEXT = "originalContextPath";

	@Resource(name = "themeResolver")
	private ThemeResolver themeResolver;

	@Resource(name = "themeSource")
	private ThemeSource themeSource;

	@Resource(name = "i18nService")
	private I18NService i18nService;


	@GetMapping(value = "/favicon.ico")
	public String getFavIcon(final HttpServletRequest request)
	{
		final String themeName = themeResolver.resolveThemeName(request);
		final Theme theme = themeSource.getTheme(themeName);
		String iconPath = "";
		if(theme == null) {
			LOGGER.error("Could not find theme for themeName: {} in request, favicon might not behave correctly", themeName);
		} else {
			iconPath = theme.getMessageSource().getMessage(FAVICON_THEME_CODE, new Object[] {}, i18nService.getCurrentLocale());
		}

		final String originalContextPath = (String) request.getAttribute(ORIGINAL_CONTEXT);
		final String hostUrl = UrlUtils.extractHostInformationFromRequest(request);
		iconPath = hostUrl + originalContextPath + iconPath;
		return REDIRECT_PREFIX + iconPath;

	}
}
