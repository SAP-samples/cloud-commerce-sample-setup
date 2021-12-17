/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.view;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.commerceservices.enums.UiExperienceLevel;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import static org.junit.Assert.assertEquals;


/**
 * The unit test for SwitchingViewResolver.
 */
@UnitTest
public class UiExperienceViewResolverTest
{
	/**
	 * Tests the UiExperienceViewResolver's getViewName method.
	 *
	 * @throws Exception
	 */
	@Test
	public void testGetViewName() throws Exception
	{
		final UiExperienceViewResolver viewResolver = new UiExperienceViewResolver();

		final Map<UiExperienceLevel, String> deviceViewPrefix = new HashMap<UiExperienceLevel, String>();
		deviceViewPrefix.put(UiExperienceLevel.DESKTOP, "desktop/");
		deviceViewPrefix.put(UiExperienceLevel.MOBILE, "mobile/");
		viewResolver.setUiExperienceViewPrefix(deviceViewPrefix);

		assertEquals("desktop/pages", viewResolver.getViewName(UiExperienceLevel.DESKTOP, "pages"));
		assertEquals("mobile/pages", viewResolver.getViewName(UiExperienceLevel.MOBILE, "pages"));
	}
}
