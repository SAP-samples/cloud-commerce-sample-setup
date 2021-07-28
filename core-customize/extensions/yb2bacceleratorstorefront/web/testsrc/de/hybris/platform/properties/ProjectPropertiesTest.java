/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.properties;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import de.hybris.bootstrap.annotations.IntegrationTest;
import de.hybris.platform.servicelayer.ServicelayerBaseTest;
import de.hybris.platform.servicelayer.config.ConfigurationService;

import javax.annotation.Resource;

import org.junit.Test;


@IntegrationTest
public class ProjectPropertiesTest extends ServicelayerBaseTest
{

	@Resource
	private ConfigurationService configurationService;


	@Test
	public void testXssFilterEnabledButPropertiesNotLoaded() throws Exception
	{
		assertTrue(getConfigurationService().getConfiguration().getBoolean("xss.filter.enabled"));
		assertEquals("", getConfigurationService().getConfiguration().getString("yb2bacceleratorstorefront.xss.filter.rule.src1"));
		assertEquals("", getConfigurationService().getConfiguration().getString("yb2bacceleratorstorefront.xss.filter.rule.src2"));
		assertEquals("", getConfigurationService().getConfiguration().getString("yb2bacceleratorstorefront.xss.filter.rule.src3"));
		assertEquals("", getConfigurationService().getConfiguration().getString("yb2bacceleratorstorefront.xss.filter.rule.braces"));
	}


	protected ConfigurationService getConfigurationService()
	{
		return configurationService;
	}

	public void setConfigurationService(final ConfigurationService configurationService)
	{
		this.configurationService = configurationService;
	}
}
