/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages.checkout.steps;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.flow.CheckoutFlowFacade;
import de.hybris.platform.acceleratorfacades.order.AcceleratorCheckoutFacade;
import de.hybris.platform.acceleratorfacades.order.AcceleratorCheckoutFacade.ExpressCheckoutResult;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commercefacades.order.data.CartModificationData;
import de.hybris.platform.commercefacades.order.data.CartRestorationData;
import de.hybris.platform.servicelayer.session.SessionService;

import java.util.Collections;

import junit.framework.Assert;

import org.junit.Before;
import org.junit.Test;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@UnitTest
public class MultiStepCheckoutControllerTest
{

	@Mock
	private SessionService sessionService;

	@Mock
	private Model model;

	@Mock
	private RedirectAttributes redirectModel;

	@Mock
	private AcceleratorCheckoutFacade checkoutFacade;

	@Mock
	private CheckoutFlowFacade checkoutFlowFacade;

	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void shouldDirectToCartRestorationReturned() throws Exception
	{
		final MultiStepCheckoutController controller = getMultiStepCheckoutController();

		final CartRestorationData cartRestoration = BDDMockito.mock(CartRestorationData.class);
		final CartModificationData modification = BDDMockito.mock(CartModificationData.class);

		BDDMockito.given(cartRestoration.getModifications()).willReturn(Collections.singletonList(modification));
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(cartRestoration);

		Assert.assertEquals("redirect:/cart", controller.performExpressCheckout(model, redirectModel));
	}


	@Test
	public void shouldDirectToSummaryNoCartRestorationReturned() throws Exception
	{
		final MultiStepCheckoutController controller = getMultiStepCheckoutController();

		BDDMockito.given(Boolean.valueOf(checkoutFlowFacade.hasValidCart())).willReturn(Boolean.TRUE);
		BDDMockito.given(checkoutFacade.performExpressCheckout()).willReturn(ExpressCheckoutResult.SUCCESS);
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(null);

		Assert.assertEquals("redirect:/checkout/multi/summary/view", controller.performExpressCheckout(model, redirectModel));
	}

	/**
	 * Inner class needed to access the sessionService of AbstractPageController.
	 */
	public MultiStepCheckoutController getMultiStepCheckoutController()
	{
		return new MultiStepCheckoutController()
		{

			@Override
			protected AcceleratorCheckoutFacade getCheckoutFacade()
			{
				return checkoutFacade;
			}

			@Override
			protected CheckoutFlowFacade getCheckoutFlowFacade()
			{
				return checkoutFlowFacade;
			}

			@Override
			protected SessionService getSessionService()
			{
				return sessionService;
			}
		};

	}
}
