/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commercefacades.order.data.CartRestorationData;
import de.hybris.platform.servicelayer.session.SessionService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.mockito.BDDMockito;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.servlet.ModelAndView;


@UnitTest
public class CartRestorationBeforeViewHandlerTest
{

	private static final Logger LOG = Logger.getLogger(CartRestorationBeforeViewHandlerTest.class);

	private final CartRestorationBeforeViewHandler restorationHandler = BDDMockito.spy(new CartRestorationBeforeViewHandler());

	private final ModelAndView modelAndView = BDDMockito.spy(new ModelAndView());

	private final Map<String, Object> modelMap = BDDMockito.spy(new HashMap());

	@Mock
	private SessionService sessionService;

	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	@Mock
	private CartRestorationData cartRestoration;

	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);

		BDDMockito.given(restorationHandler.getSessionService()).willReturn(sessionService);

		final List<String> pagesToShowModifications = new ArrayList<String>();
		pagesToShowModifications.add("/cart");
		BDDMockito.given(restorationHandler.getPagesToShowModifications()).willReturn(pagesToShowModifications);
	}

	@Test
	public void shouldShowModifications()
	{
		BDDMockito.given(request.getRequestURI()).willReturn("/something/cart");
		Assert.assertTrue(restorationHandler.showModifications(request).booleanValue());
	}

	@Test
	public void shouldNotShowModifications()
	{
		BDDMockito.given(request.getRequestURI()).willReturn("/some/uri");
		Assert.assertFalse(restorationHandler.showModifications(request).booleanValue());
	}

	@Test
	public void shouldNotShowNullRestoration()
	{
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(null);

		try
		{
			restorationHandler.beforeView(request, response, modelAndView);
		}
		catch (final Exception e)
		{
			LOG.error("shouldNotShowNullRestoration failed");
		}
		BDDMockito.verifyZeroInteractions(modelAndView);
	}

	@Test
	public void shouldNotShowRestorationFalseShow()
	{
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(cartRestoration);
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION_SHOW_MESSAGE)).willReturn(Boolean.FALSE);

		try
		{
			restorationHandler.beforeView(request, response, modelAndView);
		}
		catch (final Exception e)
		{
			LOG.error("shouldNotShowNullRestoration failed");
		}
		BDDMockito.verifyZeroInteractions(modelAndView);
	}

	@Test
	public void shouldNotShowRestorationError()
	{
		// Setup
		setupRestorationAndShowSession();
		mockModelAndShowModifications();
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION_ERROR_STATUS)).willReturn(
				WebConstants.CART_RESTORATION_ERROR_STATUS);

		try
		{
			restorationHandler.beforeView(request, response, modelAndView);
		}
		catch (final Exception e)
		{
			LOG.error("shouldNotShowNullRestoration failed");
		}
		Assert.assertNotNull(modelAndView.getModel().get("restorationErrorMsg"));
	}

	@Test
	public void shouldShowRestorationData()
	{
		// Setup
		setupRestorationAndShowSession();
		mockModelAndShowModifications();

		try
		{
			restorationHandler.beforeView(request, response, modelAndView);
		}
		catch (final Exception e)
		{
			LOG.error("shouldNotShowNullRestoration failed");
		}
		Assert.assertNotNull(modelAndView.getModel().get("restorationData"));
	}

	protected void setupRestorationAndShowSession()
	{
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(cartRestoration);
		BDDMockito.given(sessionService.getAttribute(WebConstants.CART_RESTORATION_SHOW_MESSAGE)).willReturn(Boolean.TRUE);
	}

	protected void mockModelAndShowModifications()
	{
		BDDMockito.given(modelAndView.getModel()).willReturn(modelMap);
		BDDMockito.doReturn(Boolean.TRUE).when(restorationHandler).showModifications(request);
	}
}
