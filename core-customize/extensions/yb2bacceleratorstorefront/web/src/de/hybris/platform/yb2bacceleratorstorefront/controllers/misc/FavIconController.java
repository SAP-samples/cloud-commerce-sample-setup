/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.misc;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.cms2.misc.UrlUtils;
import de.hybris.platform.servicelayer.i18n.I18NService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.context.ThemeSource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ThemeResolver;


/**
 * Controller for evil clients that go for the favicon.ico directly in the root, redirect them to the real location
 */
@Controller
public class FavIconController extends AbstractController
{
	private static final String FAVICON_THEME_CODE = "img.favIcon";
	private static final String ORIGINAL_CONTEXT = "originalContextPath";

	@Resource(name = "themeResolver")
	private ThemeResolver themeResolver;

	@Resource(name = "themeSource")
	private ThemeSource themeSource;

	@Resource(name = "i18nService")
	private I18NService i18nService;


	@RequestMapping(value = "/favicon.ico", method = RequestMethod.GET)
	public String getFavIcon(final HttpServletRequest request)
	{
		final String themeName = themeResolver.resolveThemeName(request);
		String iconPath = themeSource.getTheme(themeName).getMessageSource()
				.getMessage(FAVICON_THEME_CODE, new Object[]{}, i18nService.getCurrentLocale());
		final String originalContextPath = (String) request.getAttribute(ORIGINAL_CONTEXT);
		final String hostUrl = UrlUtils.extractHostInformationFromRequest(request);
		iconPath = hostUrl +  originalContextPath + iconPath;
		return REDIRECT_PREFIX + iconPath;
	}
}
