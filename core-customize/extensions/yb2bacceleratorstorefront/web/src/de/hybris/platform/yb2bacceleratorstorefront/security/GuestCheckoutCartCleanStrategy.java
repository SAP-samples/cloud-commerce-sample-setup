/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security;

import javax.servlet.http.HttpServletRequest;


/**
 * A strategy for clearing unwanted saved data from the cart for guest checkout.
 *
 */
public interface GuestCheckoutCartCleanStrategy
{

	/**
	 * Checks whether the request's page is to be skipped (e.g. checkout URL).
	 *
	 */
	boolean checkWhetherURLContainsSkipPattern(final HttpServletRequest request);

	/**
	 * Removes the delivery address, delivery mode, payment info from the session cart, if the guest user moves away from
	 * checkout pages.
	 *
	 */
	void cleanGuestCart(final HttpServletRequest request);
}
