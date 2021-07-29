/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorservices.config.HostConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.core.Registry;
import de.hybris.platform.util.config.ConfigIntf;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;


public class AnalyticsPropertiesBeforeViewHandler implements BeforeViewHandler
{
	private HostConfigService hostConfigService;

	// Listener - listens to changes on the frontend and update the MapCache.
	private final ConfigIntf.ConfigChangeListener cfgChangeListener = new ConfigChangeListener();

	private static final Map<String, String> analyticsPropertiesMapCache = new HashMap<>();

	private static final String ANALYTICS_TRACKING_ID = "googleAnalyticsTrackingId";

	@PostConstruct
	public void init()
	{
		// register the Change Listener to listen when the config properties are changed in the platform
		registerConfigChangeListener();
	}

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
	{
		final String serverName = request.getServerName();
		// Add config properties for google analytics
		addHostProperty(serverName, modelAndView);
	}

	protected static class ConfigChangeListener implements ConfigIntf.ConfigChangeListener
	{
		@Override
		public void configChanged(final String key, final String newValue)
		{
			// Config Listener listen to changes on the platform config and clears the cache.
			if (key.startsWith(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID))
			{
				analyticsPropertiesMapCache.clear();
			}
		}
	}

	protected ConfigIntf.ConfigChangeListener getCfgChangeListener()
	{
		return cfgChangeListener;
	}

	protected void registerConfigChangeListener()
	{
		final ConfigIntf config = Registry.getMasterTenant().getConfig();
		config.registerConfigChangeListener(getCfgChangeListener());
	}

	protected void addHostProperty(final String serverName, final ModelAndView modelAndView)
	{
		/*
		 * Changes made to cache the google analytics properties files in a HashMap. The first time the pages are accessed
		 * the values are read from the properties file & written on to a cache and the next time onwards it is accessed
		 * from the cache.
		 */
		final String fullConfigKey = ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID + "." + serverName;
		final String propertyForHost = analyticsPropertiesMapCache
				.computeIfAbsent(fullConfigKey, k -> getHostConfigService().getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, serverName));
		modelAndView.addObject(AnalyticsPropertiesBeforeViewHandler.ANALYTICS_TRACKING_ID, propertyForHost);
	}

	public void setHostConfigService(final HostConfigService hostConfigService)
	{
		this.hostConfigService = hostConfigService;
	}

	protected HostConfigService getHostConfigService()
	{
		return hostConfigService;
	}
}
