/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;


/**
 * Request wrapper that wraps an innerRequest, and overlays on top of it the cookies from the outerRequest.
 */
public class CookieMergingHttpServletRequestWrapper extends HttpServletRequestWrapper
{
	private final HttpServletRequest outerRequest;

	public CookieMergingHttpServletRequestWrapper(final HttpServletRequest innerRequest, final HttpServletRequest outerRequest)
	{
		super(innerRequest);
		this.outerRequest = outerRequest;
	}

	@Override
	public Cookie[] getCookies()
	{
		return mergeCookies(super.getCookies(), outerRequest.getCookies());
	}

	protected Cookie[] mergeCookies(final Cookie[] savedCookies, final Cookie[] currentCookies)
	{
		// Start with the cookies from the current request as these will be more up to date
		final List<Cookie> cookies = new ArrayList<Cookie>(Arrays.asList(currentCookies));

		// Add any missing ones from the saved request
		for (final Cookie savedCookie : savedCookies)
		{
			if (!containsCookie(cookies, savedCookie.getName()))
			{
				cookies.add(savedCookie);
			}
		}

		return cookies.toArray(new Cookie[cookies.size()]);
	}

	protected boolean containsCookie(final List<Cookie> cookies, final String cookieName)
	{
		if (cookies != null && !cookies.isEmpty() && cookieName != null)
		{
			for (final Cookie cookie : cookies)
			{
				if (cookieName.equals(cookie.getName()))
				{
					return true;
				}
			}
		}
		return false;
	}
}
