/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.mvc;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.util.UrlPathHelper;


/**
 * This class is a bean post-processor for RequestMappingHandlerMapping. This required to set the property values in the
 * instance of RequestMappingHandlerMapping created by the spring framework when using the tag <annotation-driven/>
 */
public class RequestMappingHandlerAdapterConfigurer
{
	@Resource
	private List<RequestMappingHandlerMapping> requestMappingHandlerMappings;

	@Resource
	private RequestMappingHandlerAdapter requestMappingHandlerAdapter;

	private UrlPathHelper urlPathHelper;

	public void init()
	{
		for (final RequestMappingHandlerMapping requestMappingHandlerMapping : requestMappingHandlerMappings)
		{
			requestMappingHandlerMapping.setUrlPathHelper(getUrlPathHelper());
		}

		requestMappingHandlerAdapter.setSynchronizeOnSession(true);
	}

	protected UrlPathHelper getUrlPathHelper()
	{
		return urlPathHelper;
	}

	public void setUrlPathHelper(final UrlPathHelper urlPathHelper)
	{
		this.urlPathHelper = urlPathHelper;
	}
}
