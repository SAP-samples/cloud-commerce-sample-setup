/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.platform.yb2bacceleratorstorefront.security.GuestCheckoutCartCleanStrategy;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.filter.OncePerRequestFilter;


public class AnonymousCheckoutFilter extends OncePerRequestFilter
{

	private GuestCheckoutCartCleanStrategy guestCheckoutCartCleanStrategy;

	@Override
	protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws ServletException, IOException
	{
		getGuestCheckoutCartCleanStrategy().cleanGuestCart(request);
		filterChain.doFilter(request, response);
	}

	public GuestCheckoutCartCleanStrategy getGuestCheckoutCartCleanStrategy()
	{
		return guestCheckoutCartCleanStrategy;
	}

	@Required
	public void setGuestCheckoutCartCleanStrategy(final GuestCheckoutCartCleanStrategy guestCheckoutCartCleanStrategy)
	{
		this.guestCheckoutCartCleanStrategy = guestCheckoutCartCleanStrategy;
	}

}
