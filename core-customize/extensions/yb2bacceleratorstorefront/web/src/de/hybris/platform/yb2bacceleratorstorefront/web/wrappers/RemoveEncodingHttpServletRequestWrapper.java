/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.wrappers;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.lang.StringUtils;


/**
 * RemoveEncodingHttpServletRequestWrapper removes encoding attributes such as languages and site name from the context
 * path of HttpServletRequest
 */
public class RemoveEncodingHttpServletRequestWrapper extends HttpServletRequestWrapper
{
	private final String pattern;

	public RemoveEncodingHttpServletRequestWrapper(final HttpServletRequest request, final String pattern)
	{
		super(request);
		this.pattern = pattern;
	}

	@Override
	public String getContextPath()
	{
		return StringUtils.remove(super.getContextPath(), pattern);
	}
}
