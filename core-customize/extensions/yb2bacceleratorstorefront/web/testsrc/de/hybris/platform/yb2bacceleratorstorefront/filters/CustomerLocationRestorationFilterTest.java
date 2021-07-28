/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.customerlocation.CustomerLocationFacade;
import de.hybris.platform.acceleratorservices.store.data.UserLocationData;
import de.hybris.platform.yb2bacceleratorstorefront.security.cookie.CustomerLocationCookieGenerator;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;


@UnitTest
public class CustomerLocationRestorationFilterTest
{

	private final static String COOKIE_NAME = "customerLocationCookie";

	@InjectMocks
	private final CustomerLocationRestorationFilter filter = new CustomerLocationRestorationFilter();

	@Mock
	private CustomerLocationFacade customerLocationFacade;

	@Mock
	private CustomerLocationCookieGenerator cookieGenerator;

	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	@Mock
	private FilterChain filterChain;


	@Before
	public void setup()
	{
		MockitoAnnotations.initMocks(this);
		final Cookie cookie = mock(Cookie.class);
		given(cookie.getName()).willReturn(COOKIE_NAME);
		final Cookie[] cookies = { cookie };

		given(request.getCookies()).willReturn(cookies);
	}


	@Test
	public void testBrandNewUser() throws ServletException, IOException
	{
		// Scenario:
		// User visits the website for the first time or has cleared all cookies
		given(cookieGenerator.getCookieName()).willReturn("");

		filter.doFilterInternal(request, response, filterChain);

		// Expect to check cookies
		verify(request, times(1)).getCookies();

		// Expect no userLocationData to be set
		verify(customerLocationFacade, never()).setUserLocationData(any(UserLocationData.class));
	}

	@Test
	public void testRegularUser() throws ServletException, IOException
	{
		// Scenario:
		// User selects a store location, then decides to pickup an item
		final UserLocationData userLocationData = mock(UserLocationData.class);
		given(customerLocationFacade.getUserLocationData()).willReturn(userLocationData);

		filter.doFilterInternal(request, response, filterChain);

		// Expect not to check cookies
		verify(request, never()).getCookies();

		// Expect no userLocationData to be set
		verify(customerLocationFacade, never()).setUserLocationData(any(UserLocationData.class));
	}

	@Test
	public void testLoggedInUserWhoLogsOut() throws ServletException, IOException
	{
		// Scenario:
		// User selects a store location, logs in, then logs out to end the session
		// The user then decides to pickup another item
		given(cookieGenerator.getCookieName()).willReturn(COOKIE_NAME);

		filter.doFilterInternal(request, response, filterChain);

		// Expect to check cookies
		verify(request, times(1)).getCookies();

		// Expect a userLocationData to be set
		verify(customerLocationFacade, times(1)).setUserLocationData(any(UserLocationData.class));
	}


    @Test
    public void testCustomerLocationCookieValueForWeblogic() throws ServletException, IOException
    {
        //Test for weblogic
        given(cookieGenerator.getCookieName()).willReturn("electronics-customerLocation");
        final Cookie[] cookies = {new Cookie("electronics-customerLocation","\"japan|0.0,0.0\"")};
        given(request.getCookies()).willReturn(cookies);

        filter.doFilterInternal(request, response, filterChain);
        verify(customerLocationFacade, times(1)).setUserLocationData(any(UserLocationData.class));
    }


    @Test
    public void testCustomerLocationCookieValue() throws ServletException, IOException
    {
        given(cookieGenerator.getCookieName()).willReturn("apparel-uk-customerLocation");
        final Cookie[] cookies = {new Cookie("apparel-uk-customerLocation","japan|-445.0,-123.767")};
        given(request.getCookies()).willReturn(cookies);

        filter.doFilterInternal(request, response, filterChain);
        verify(customerLocationFacade, times(1)).setUserLocationData(any(UserLocationData.class));

        given(cookieGenerator.getCookieName()).willReturn("apparel-uk-customerLocation");
        final Cookie[] emptyValue = {new Cookie("apparel-uk-customerLocation","")};
        given(request.getCookies()).willReturn(emptyValue);

        filter.doFilterInternal(request, response, filterChain);
        verify(customerLocationFacade, times(2)).setUserLocationData(any(UserLocationData.class));
    }
}
