/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import java.io.IOException;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.http.HttpMethod;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.multipart.support.MultipartFilter;


public class FileUploadFilter extends OncePerRequestFilter
{
	private Map<String, MultipartFilter> urlFilterMapping;
	private PathMatcher pathMatcher;

	@Override
	public void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws IOException, ServletException
	{
		if (HttpMethod.POST.name().equalsIgnoreCase(request.getMethod()))
		{
			final MultipartFilter multipartFilter = getMultipartFilter(request.getServletPath());
			if (multipartFilter != null)
			{
				multipartFilter.doFilter(request, response, filterChain);
			}
			else
			{
				filterChain.doFilter(request, response);
			}
		}
		else
		{
			filterChain.doFilter(request, response);
		}
	}

	protected MultipartFilter getMultipartFilter(final String servletPath)
	{
		for (Map.Entry<String, MultipartFilter> urlFilterMapping : getUrlFilterMapping().entrySet())
		{
			if (getPathMatcher().match(urlFilterMapping.getKey(), servletPath))
			{
				return urlFilterMapping.getValue();
			}
		}

		return null;
	}

	protected Map<String, MultipartFilter> getUrlFilterMapping()
	{
		return urlFilterMapping;
	}

	@Required
	public void setUrlFilterMapping(final Map<String, MultipartFilter> urlFilterMapping)
	{
		this.urlFilterMapping = urlFilterMapping;
	}

	protected PathMatcher getPathMatcher()
	{
		return pathMatcher;
	}

	@Required
	public void setPathMatcher(final PathMatcher pathMatcher)
	{
		this.pathMatcher = pathMatcher;
	}
}
