/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.ModelAndView;


/**
 * Class to gather value of storefront.wro4j.enabled from properties file, which can enable wro4j.
 */
public class ConfigWro4jBeforeViewHandler implements BeforeViewHandler
{
	private SiteConfigService siteConfigService;

	protected SiteConfigService getSiteConfigService()
	{
		return siteConfigService;
	}

	@Required
	public void setSiteConfigService(final SiteConfigService siteConfigService)
	{
		this.siteConfigService = siteConfigService;
	}

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
			throws Exception
	{
		modelAndView.addObject("wro4jEnabled",
				Boolean.valueOf(getSiteConfigService().getBoolean("storefront.wro4j.enabled", false)));
	}
}
