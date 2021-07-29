/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import java.io.IOException;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.UrlPathHelper;

/**
 */
public class UrlPathFilter extends OncePerRequestFilter
{
	private UrlPathHelper urlPathHelper;
	private Map<String, Filter> urlPathMapping;
	private Filter defaultFilter;

	public UrlPathHelper getUrlPathHelper()
	{
		return urlPathHelper;
	}

	@Required
	public void setUrlPathHelper(final UrlPathHelper urlPathHelper)
	{
		this.urlPathHelper = urlPathHelper;
	}

	public Map<String, Filter> getUrlPathMapping()
	{
		return urlPathMapping;
	}

	public void setUrlPathMapping(final Map<String, Filter> urlPathMapping)
	{
		this.urlPathMapping = urlPathMapping;
	}

	public Filter getDefaultFilter()
	{
		return defaultFilter;
	}

	@Required
	public void setDefaultFilter(final Filter defaultFilter)
	{
		this.defaultFilter = defaultFilter;
	}

	@Override
	protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response, final FilterChain filterChain) throws ServletException, IOException
	{
		final Map<String, Filter> mapping = getUrlPathMapping();
		if (mapping != null && !mapping.isEmpty())
		{
			final String servletPath = getUrlPathHelper().getServletPath(request);
			for (final Map.Entry<String, Filter> entry : mapping.entrySet())
			{
				if (servletPath.startsWith(entry.getKey()))
				{
					entry.getValue().doFilter(request, response, filterChain);
					return;
				}
			}
		}
		getDefaultFilter().doFilter(request, response, filterChain);
	}
}
