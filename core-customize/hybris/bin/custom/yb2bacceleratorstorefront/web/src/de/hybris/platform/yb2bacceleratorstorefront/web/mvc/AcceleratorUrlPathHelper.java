/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.mvc;

import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.util.UrlPathHelper;

/**
 * This implementation overrides the default implementation of Spring framework's {@link UrlPathHelper}
 * so that context path and servlet mapping tricks Spring MVC as if UrlEncoding is not present.
 */
public class AcceleratorUrlPathHelper extends UrlPathHelper
{
	private boolean alwaysUseFullPath;

	@Override
	public String getContextPath(final HttpServletRequest request)
	{
		final Object urlEncodingAttributes = request.getAttribute(WebConstants.URL_ENCODING_ATTRIBUTES);
		final String contextPath = super.getContextPath(request);

		final String toRemove = urlEncodingAttributes != null ? urlEncodingAttributes.toString() : "";
		return StringUtils.remove(contextPath, toRemove);
	}

	@Override
	public String getPathWithinServletMapping(final HttpServletRequest request)
	{
		final String servletPath = super.getServletPath(request);
		if ("".equals(servletPath))
		{
			return "/";
		}
		return super.getPathWithinServletMapping(request);
	}

	@Override
	public String getLookupPathForRequest(HttpServletRequest request)
	{
		final String pathWithinApplication = getPathWithinApplication(request);

		// Always use full path within current servlet context?
		if (this.alwaysUseFullPath)
		{
			return pathWithinApplication;
		}

		// Else, use path within current servlet mapping if applicable
		final String rest = getPathWithinServletMapping(request);
		if (org.springframework.util.StringUtils.hasLength(rest))
		{
			return rest;
		}
		return pathWithinApplication;
	}

	@Override
	public void setAlwaysUseFullPath(final boolean alwaysUseFullPath)
	{
		super.setAlwaysUseFullPath(alwaysUseFullPath);
		this.alwaysUseFullPath = alwaysUseFullPath;
	}
}
