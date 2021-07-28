/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commercefacades.order.data.CartRestorationData;
import de.hybris.platform.servicelayer.session.SessionService;

import junit.framework.Assert;

import org.junit.Before;
import org.junit.Test;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;
import org.springframework.validation.support.BindingAwareModelMap;


@UnitTest
public class CartPageControllerTest
{

	private final CartPageController controller = Mockito.spy(new CartPageController());

	private final Model page = Mockito.spy(new BindingAwareModelMap());

	@Mock
	private SiteConfigService service;

	@Mock
	private SessionService sessionService;

	@Mock
	private CartRestorationData restorationData;

	@Before
	public void prepare()
	{
		MockitoAnnotations.initMocks(this);
		//
		BDDMockito.given(controller.getSiteConfigService()).willReturn(service);
		restorationData = Mockito.mock(CartRestorationData.class);
	}

	@Test
	public void testNullProperty()
	{
		BDDMockito.given(service.getProperty(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS)).willReturn(null);

		Assert.assertFalse(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testSomeStringProperty()
	{
		BDDMockito.given(service.getProperty(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS)).willReturn("someString");

		Assert.assertFalse(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testTrueStringProperty()
	{
		BDDMockito.given(service.getBoolean(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS, false)).willReturn(Boolean.TRUE);

		Assert.assertTrue(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testZeroStringProperty()
	{
		BDDMockito.given(service.getProperty(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS)).willReturn("0");

		Assert.assertFalse(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testEmptyStringProperty()
	{
		BDDMockito.given(service.getProperty(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS)).willReturn("");

		Assert.assertFalse(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testEmptyEmptyStringProperty()
	{
		BDDMockito.given(service.getProperty(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS)).willReturn(" ");

		Assert.assertFalse(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testSetupCartPageNullRestoration()
	{
		final CartPageController cartPageController = getCartPageController();
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(null);
		cartPageController.setupCartPageRestorationData(page);
		Assert.assertTrue(page.containsAttribute("showModifications"));
	}

	@Test
	public void testSetupCartPageErrorRestoration()
	{
		final CartPageController cartPageController = getCartPageController();
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(restorationData);
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION_ERROR_STATUS)).willReturn(
				WebConstants.CART_RESTORATION_ERROR_STATUS);
		cartPageController.setupCartPageRestorationData(page);

		Assert.assertTrue(page.containsAttribute("restorationErrorMsg"));
	}

	@Test
	public void testSetupCartPageSuccessfulRestoration()
	{
		final CartPageController cartPageController = getCartPageController();
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(restorationData);
		cartPageController.setupCartPageRestorationData(page);

		Assert.assertTrue(page.containsAttribute("restorationData"));
		Assert.assertTrue(page.containsAttribute("showModifications"));
	}

	public CartPageController getCartPageController()
	{
		return new CartPageController()
		{
			@Override
			protected SessionService getSessionService()
			{
				return sessionService;
			}
		};

	}
}
