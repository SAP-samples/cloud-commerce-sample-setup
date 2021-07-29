/*
 * Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorservices.config.HostConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.web.servlet.ModelAndView;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class AnalyticsPropertiesBeforeViewHandlerTest
{
	private static final String TEST_SERVER_NAME_1 = "serverName1";
	private static final String TEST_SERVER_NAME_2 = "serverName2";

	private static final String TEST_PROP_1 = "property1";
	private static final String TEST_PROP_2 = "property2";
	private static final String NEW_CONFIG_VALUE = "FooBar";

	@InjectMocks
	private AnalyticsPropertiesBeforeViewHandler viewHandler;

	@Mock
	private HostConfigService hostConfigService;
	@Mock
	private HttpServletRequest httpServletRequest;
	@Mock
	private HttpServletResponse httpServletResponse;
	@Mock
	private ModelAndView model;

	@Before
	public void setUp()
	{
		viewHandler.getCfgChangeListener().configChanged(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID,"");
		viewHandler = spy(viewHandler);

		doNothing().when(viewHandler).registerConfigChangeListener();

		when(httpServletRequest.getServerName()).thenReturn(TEST_SERVER_NAME_1);
		when(hostConfigService.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_1))
				.thenReturn(TEST_PROP_1);
		when(hostConfigService.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_2))
				.thenReturn(TEST_PROP_2);
	}

	@Test
	public void testBeforeView_callOnce()
	{
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(model, times(1)).addObject("googleAnalyticsTrackingId", TEST_PROP_1);
	}

	@Test
	public void testBeforeView_callWithDifferentServers()
	{
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);
		when(httpServletRequest.getServerName()).thenReturn(TEST_SERVER_NAME_2);
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(model, times(1)).addObject("googleAnalyticsTrackingId", TEST_PROP_1);
		verify(model, times(1)).addObject("googleAnalyticsTrackingId", TEST_PROP_2);
	}

	@Test
	public void testAnalyticsTrackingIdIsCached()
	{
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(hostConfigService, times(1))
				.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_1);
	}

	@Test
	public void testClearCacheOnUpdateConfig_ServerKey()
	{
		final String changedConfigKey = ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID + "." + TEST_SERVER_NAME_1;

		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);
		viewHandler.getCfgChangeListener().configChanged(changedConfigKey, NEW_CONFIG_VALUE);

		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(hostConfigService, times(2))
				.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_1);

	}

	@Test
	public void testClearCacheOnUpdateConfig_RootKey()
	{
		final String changedConfigKey = ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID;

		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);
		viewHandler.getCfgChangeListener().configChanged(changedConfigKey, NEW_CONFIG_VALUE);
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(hostConfigService, times(2))
				.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_1);

	}

	@Test
	public void testNoClearCacheOnUpdateConfig_OtherKey()
	{
		final String changedConfigKey = "unrelated.config.key";

		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);
		viewHandler.getCfgChangeListener().configChanged(changedConfigKey, NEW_CONFIG_VALUE);
		viewHandler.beforeView(httpServletRequest, httpServletResponse, model);

		verify(hostConfigService, times(1))
				.getProperty(ThirdPartyConstants.Google.ANALYTICS_TRACKING_ID, TEST_SERVER_NAME_1);

	}
}
