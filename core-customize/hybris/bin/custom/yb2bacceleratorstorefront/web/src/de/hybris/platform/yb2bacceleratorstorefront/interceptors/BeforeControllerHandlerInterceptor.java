/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors;

import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeControllerHandler;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * A postHandle HandlerInterceptor that runs a number of BeforeViewHandlers before the view is rendered.
 */
public class BeforeControllerHandlerInterceptor implements HandlerInterceptor
{
	private static final String INTERCEPTOR_ONCE_KEY = BeforeControllerHandlerInterceptor.class.getName();

	private List<BeforeControllerHandler> beforeControllerHandlers;

	protected List<BeforeControllerHandler> getBeforeControllerHandlers()
	{
		return beforeControllerHandlers;
	}

	@Required
	public void setBeforeControllerHandlers(final List<BeforeControllerHandler> beforeControllerHandlers)
	{
		this.beforeControllerHandlers = beforeControllerHandlers;
	}

	@Override
	public boolean preHandle(final HttpServletRequest request, final HttpServletResponse response, final Object handler) throws Exception
	{
		if (request.getAttribute(INTERCEPTOR_ONCE_KEY) == null)
		{
			// Set the flag so that we are not executed multiple times
			request.setAttribute(INTERCEPTOR_ONCE_KEY, Boolean.TRUE);

			final HandlerMethod handlerMethod = (HandlerMethod) handler;

			// Call the pre handler once for the request
			for (final BeforeControllerHandler beforeControllerHandler : getBeforeControllerHandlers())
			{
				if (!beforeControllerHandler.beforeController(request, response, handlerMethod))
				{
					// Return false immediately if a handler returns false
					return false;
				}
			}
		}

		return true;
	}
}
