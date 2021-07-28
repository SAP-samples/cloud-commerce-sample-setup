/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commerceservices.strategies.impl.DefaultCheckoutCustomerStrategy;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.order.delivery.DeliveryModeModel;
import de.hybris.platform.core.model.order.payment.PaymentInfoModel;
import de.hybris.platform.core.model.user.AddressModel;
import de.hybris.platform.core.model.user.CustomerModel;
import de.hybris.platform.order.CartService;
import de.hybris.platform.servicelayer.session.SessionService;
import de.hybris.platform.servicelayer.user.UserService;

import java.io.IOException;
import java.util.Arrays;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


/**
 * Unit Test for {@link DefaultGuestCheckoutCartCleanStrategy}
 *
 */
@UnitTest
public class DefaultGuestCheckoutCartCleanStrategyTest
{
	private static final String CHECKOUT_URL_PATTERN = "(^https://.*/checkout/.*)";
	private static final String FAVICON_PATTERN = "(^https://.*/favicon.ico.*)";
	private static final String HTTP_REQUEST_GET_METHOD = "GET";
	private static final String HTTP_REQUEST_POST_METHOD = "POST";
	public static final String AJAX_REQUEST_HEADER_NAME = "X-Requested-With";

	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpSession session;
	@Mock
	private HttpSession httpSession;
	@Mock
	private FilterChain filterChain;
	@Mock
	private UserService userService;
	@Mock
	private CustomerModel customer;
	@Mock
	private CustomerModel guestCustomer;
	@Mock
	private DefaultCheckoutCustomerStrategy checkoutCustomerStrategy;
	@Mock
	private CartService cartService;
	@Mock
	private SessionService sessionService;
	@InjectMocks
	private final DefaultGuestCheckoutCartCleanStrategy guestCheckoutCartCleanStrategy = new DefaultGuestCheckoutCartCleanStrategy();


	@Before
	public void prepare()
	{
		MockitoAnnotations.initMocks(this);
		guestCheckoutCartCleanStrategy.setSkipPatterns(Arrays.asList(CHECKOUT_URL_PATTERN, FAVICON_PATTERN));
	}

	@Test
	public void testForGuestAbandonAnonymousCheckout() throws IOException, ServletException
	{

		given(sessionService.getAttribute(WebConstants.ANONYMOUS_CHECKOUT)).willReturn(Boolean.TRUE);
		given(Boolean.valueOf(checkoutCustomerStrategy.isAnonymousCheckout())).willReturn(Boolean.TRUE);
		given(request.getSession()).willReturn(session);
		given(request.getMethod()).willReturn(HTTP_REQUEST_GET_METHOD);
		given(request.getRequestURL()).willReturn(new StringBuffer(
				"https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/Open-Catalogue/Cameras/Digital-Cameras/Digital-Compacts/PowerShot-A480/p/1934793"));

		final CartModel cartModel = mock(CartModel.class);
		final AddressModel addressModel = mock(AddressModel.class);
		final DeliveryModeModel deliveryModeModel = mock(DeliveryModeModel.class);
		final PaymentInfoModel paymentModeModel = mock(PaymentInfoModel.class);
		cartModel.setDeliveryAddress(addressModel);
		cartModel.setDeliveryMode(deliveryModeModel);
		cartModel.setPaymentInfo(paymentModeModel);
		given(cartService.getSessionCart()).willReturn(cartModel);
		guestCheckoutCartCleanStrategy.cleanGuestCart(request);

		verify(cartModel).setDeliveryAddress(null);
		verify(cartModel).setDeliveryMode(null);
		verify(cartModel).setPaymentInfo(null);
		verify(cartModel).setUser(userService.getAnonymousUser());
		verify(sessionService).removeAttribute(WebConstants.ANONYMOUS_CHECKOUT);
		verify(sessionService).removeAttribute(WebConstants.ANONYMOUS_CHECKOUT_GUID);
	}


	@Test
	public void testForGuestInAnonymousCheckout() throws IOException, ServletException
	{
		given(sessionService.getAttribute(WebConstants.ANONYMOUS_CHECKOUT)).willReturn(Boolean.TRUE);
		given(Boolean.valueOf(checkoutCustomerStrategy.isAnonymousCheckout())).willReturn(Boolean.TRUE);
		given(request.getMethod()).willReturn(HTTP_REQUEST_GET_METHOD);
		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkout/multi"));
		given(request.getSession()).willReturn(session);

		final CartModel cartModel = mock(CartModel.class);
		given(cartService.getSessionCart()).willReturn(cartModel);
		guestCheckoutCartCleanStrategy.cleanGuestCart(request);

		verifyNoMoreInteractions(cartModel);
	}

	@Test
	public void testForGuestInAnonymousCheckoutForPostRequest() throws IOException, ServletException
	{
		given(sessionService.getAttribute(WebConstants.ANONYMOUS_CHECKOUT)).willReturn(Boolean.TRUE);
		given(Boolean.valueOf(checkoutCustomerStrategy.isAnonymousCheckout())).willReturn(Boolean.TRUE);
		given(request.getMethod()).willReturn(HTTP_REQUEST_POST_METHOD);
		given(request.getSession()).willReturn(session);

		final CartModel cartModel = mock(CartModel.class);
		given(cartService.getSessionCart()).willReturn(cartModel);
		guestCheckoutCartCleanStrategy.cleanGuestCart(request);

		verifyNoMoreInteractions(cartModel);
	}

	@Test
	public void testForGuestInAnonymousCheckoutForAjaxRequest() throws IOException, ServletException
	{
		given(sessionService.getAttribute(WebConstants.ANONYMOUS_CHECKOUT)).willReturn(Boolean.TRUE);
		given(Boolean.valueOf(checkoutCustomerStrategy.isAnonymousCheckout())).willReturn(Boolean.TRUE);
		given(request.getMethod()).willReturn(HTTP_REQUEST_GET_METHOD);
		given(request.getHeader(AJAX_REQUEST_HEADER_NAME)).willReturn(AJAX_REQUEST_HEADER_NAME);
		given(request.getRequestURL()).willReturn(
				new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/my-account/addressform"));
		given(request.getSession()).willReturn(session);

		final CartModel cartModel = mock(CartModel.class);
		given(cartService.getSessionCart()).willReturn(cartModel);
		guestCheckoutCartCleanStrategy.cleanGuestCart(request);

		verifyNoMoreInteractions(cartModel);
	}

	@Test
	public void testWhetherURLContainsCheckoutPattern() throws IOException, ServletException
	{
		given(request.getRequestURL()).willReturn(
				new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/my-account/addressform"));
		assertEquals(Boolean.FALSE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkou/multi"));
		assertEquals(Boolean.FALSE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL())
				.willReturn(new StringBuffer("electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkout/multi"));
		assertEquals(Boolean.FALSE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkout/multi"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL()).willReturn(new StringBuffer(
				"https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkout/multi/payment-method/add"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL()).willReturn(new StringBuffer(
				"https://electronics.local:9002/yb2bacceleratorstorefront/electronics/en/checkout/multi/delivery-address/add"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));
	}

	@Test
	public void testWhetherURLContainsFaviconPattern() throws IOException, ServletException
	{
		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/favicon"));
		assertEquals(Boolean.FALSE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL()).willReturn(new StringBuffer(
				"https://electronics.local:9002/yb2bacceleratorstorefront/_ui/responsive/theme-alpha/images/favicon.ico"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/yb2bacceleratorstorefront/favicon.ico"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL())
				.willReturn(new StringBuffer("https://electronics.local:9002/_ui/responsive/theme-alpha/images/favicon.ico"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));

		given(request.getRequestURL()).willReturn(new StringBuffer("https://electronics.local:9002/favicon.ico"));
		assertEquals(Boolean.TRUE, Boolean.valueOf(guestCheckoutCartCleanStrategy.checkWhetherURLContainsSkipPattern(request)));
	}
}
