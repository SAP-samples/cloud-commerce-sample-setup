/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforecontroller;

import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeControllerHandler;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.ui.context.ThemeSource;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.ThemeResolver;


public class ThemeBeforeControllerHandler implements BeforeControllerHandler
{
	@Resource(name = "themeResolver")
	private ThemeResolver themeResolver;

	@Resource(name = "themeSource")
	private ThemeSource themeSource;


	@Override
	public boolean beforeController(final HttpServletRequest request, final HttpServletResponse response, final HandlerMethod handler) throws Exception
	{
		themeSource.getTheme(themeResolver.resolveThemeName(request));
		return true;
	}
}
