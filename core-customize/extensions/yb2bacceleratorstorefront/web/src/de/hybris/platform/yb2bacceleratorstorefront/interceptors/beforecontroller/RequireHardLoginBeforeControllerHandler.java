/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforecontroller;

import java.lang.annotation.Annotation;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.web.method.HandlerMethod;

import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeControllerHandler;
import de.hybris.platform.yb2bacceleratorstorefront.security.evaluator.impl.RequireHardLoginEvaluator;


/**
 */
public class RequireHardLoginBeforeControllerHandler implements BeforeControllerHandler
{
	private static final Logger LOG = Logger.getLogger(RequireHardLoginBeforeControllerHandler.class);

	public static final String SECURE_GUID_SESSION_KEY = "acceleratorSecureGUID";

	private String loginUrl;
	private String loginAndCheckoutUrl;
	private RedirectStrategy redirectStrategy;
	private RequireHardLoginEvaluator requireHardLoginEvaluator;

	protected String getLoginUrl()
	{
		return loginUrl;
	}

	@Required
	public void setLoginUrl(final String loginUrl)
	{
		this.loginUrl = loginUrl;
	}

	protected RedirectStrategy getRedirectStrategy()
	{
		return redirectStrategy;
	}

	@Required
	public void setRedirectStrategy(final RedirectStrategy redirectStrategy)
	{
		this.redirectStrategy = redirectStrategy;
	}

	public String getLoginAndCheckoutUrl()
	{
		return loginAndCheckoutUrl;
	}

	@Required
	public void setLoginAndCheckoutUrl(final String loginAndCheckoutUrl)
	{
		this.loginAndCheckoutUrl = loginAndCheckoutUrl;
	}

	protected RequireHardLoginEvaluator getRequireHardLoginEvaluator()
	{
		return requireHardLoginEvaluator;
	}

	@Required
	public void setRequireHardLoginEvaluator(RequireHardLoginEvaluator requireHardLoginEvaluator)
	{
		this.requireHardLoginEvaluator = requireHardLoginEvaluator;
	}

	@Override
	public boolean beforeController(final HttpServletRequest request, final HttpServletResponse response,
			final HandlerMethod handler) throws Exception
	{
		// We only care if the request is secure
		if (request.isSecure())
		{
			// Check if the handler has our annotation
			final RequireHardLogIn annotation = findAnnotation(handler, RequireHardLogIn.class);
			if (annotation != null)
			{
				boolean redirect = requireHardLoginEvaluator.evaluate(request, response);

				if (redirect)
				{
					LOG.warn("Redirection required");
					getRedirectStrategy().sendRedirect(request, response, getRedirectUrl(request));
					return false;
				}
			}
		}

		return true;
	}

	protected String getRedirectUrl(final HttpServletRequest request)
	{
		if (request != null && request.getServletPath().contains("checkout"))
		{
			return getLoginAndCheckoutUrl();
		}
		else
		{
			return getLoginUrl();
		}
	}

	protected <T extends Annotation> T findAnnotation(final HandlerMethod handlerMethod, final Class<T> annotationType)
	{
		// Search for method level annotation
		final T annotation = handlerMethod.getMethodAnnotation(annotationType);
		if (annotation != null)
		{
			return annotation;
		}

		// Search for class level annotation
		return AnnotationUtils.findAnnotation(handlerMethod.getBeanType(), annotationType);
	}
}
