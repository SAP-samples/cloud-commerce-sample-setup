/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorservices.config.HostConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.servicelayer.config.ConfigurationService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.ModelAndView;


/**
 * Filter to load Google Maps API Keys into the model.
 *
 */
public class GoogleMapsBeforeViewHandler implements BeforeViewHandler
{

	private static final String GOOGLE_API_KEY_ID = "googleApiKey";
	private static final String GOOGLE_API_VERSION = "googleApiVersion";

	@Resource(name = "hostConfigService")
	private HostConfigService hostConfigService;

	@Resource(name = "configurationService")
	private ConfigurationService configurationService;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
			throws Exception
	{
		modelAndView.addObject("googleApiVersion", configurationService.getConfiguration().getString(GOOGLE_API_VERSION));
		final String googleApiKey = hostConfigService.getProperty(GOOGLE_API_KEY_ID, request.getServerName());
		if (StringUtils.isNotEmpty(googleApiKey))
		{
			modelAndView.addObject("googleApiKey", googleApiKey);
		}
	}

}
