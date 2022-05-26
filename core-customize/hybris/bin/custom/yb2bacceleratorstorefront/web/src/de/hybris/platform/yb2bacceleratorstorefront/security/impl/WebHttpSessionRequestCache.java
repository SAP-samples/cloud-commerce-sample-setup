/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.servicelayer.session.SessionService;

import java.io.Serializable;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.PortResolver;
import org.springframework.security.web.PortResolverImpl;
import org.springframework.security.web.savedrequest.DefaultSavedRequest;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.SavedRequest;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;


/**
 * Extension of HttpSessionRequestCache that allows pass through of cookies from the current request. This is required
 * to allow the GUIDInterceptor to see the secure cookie written during authentication.
 *
 * The <tt>RequestCache</tt> stores the <tt>SavedRequest</tt> in the HttpSession, this is then restored perfectly.
 * Unfortunately the saved request also hides new cookies that have been written since the saved request was created.
 * This implementation allows the current request's cookie values to override the cookies within the saved request.
 */
public class WebHttpSessionRequestCache extends HttpSessionRequestCache implements Serializable
{
	private static final Logger LOG = Logger.getLogger(WebHttpSessionRequestCache.class);

	private static final long serialVersionUID = 1L;
	private static final String REFERER = "referer";

	static final String SAVED_REQUEST = "SPRING_SECURITY_SAVED_REQUEST";

	private transient PortResolver portResolver = new PortResolverImpl();
	private transient RequestMatcher requestMatcher = AnyRequestMatcher.INSTANCE;
	private boolean createSessionAllowed = true;

	private transient SessionService sessionService;

	@Required
	public void setSessionService(final SessionService sessionService)
	{
		this.sessionService = sessionService;
	}

	public SessionService getSessionService()
	{
		return sessionService;
	}



	@Override
	public void setRequestMatcher(final RequestMatcher requestMatcher)
	{
		this.requestMatcher = requestMatcher;
		super.setRequestMatcher(requestMatcher);
	}


	@Override
	public void setPortResolver(final PortResolver portResolver)
	{
		this.portResolver = portResolver;
		super.setPortResolver(portResolver);
	}


	@Override
	public void setCreateSessionAllowed(final boolean createSessionAllowed)
	{
		this.createSessionAllowed = createSessionAllowed;
	}

	@Override
	public void saveRequest(final HttpServletRequest request, final HttpServletResponse response)
	{
		//this might be called while in ExceptionTranslationFilter#handleSpringSecurityException in this case base implementation
		if (SecurityContextHolder.getContext().getAuthentication() == null)
		{
			super.saveRequest(request, response);
		}
		else
		{
			final SavedRequest savedBefore = getRequest(request, response);
			if (savedBefore != null)//to not override request saved by ExceptionTranslationFilter#handleSpringSecurityException
			{
				return;
			}

			if (getRequestMatcher().matches(request))
			{
				final DefaultSavedRequest savedRequest = new RedirectAwareSavedRequest(request, getPortResolver());

				if (isCreateSessionAllowed() || request.getSession(false) != null)
				{
					request.getSession().setAttribute(SAVED_REQUEST, savedRequest);
					LOG.debug("DefaultSavedRequest added to Session: " + savedRequest);
				}
			}
			else
			{
				LOG.debug("Request not saved as configured RequestMatcher did not match");
			}
		}
	}


	protected boolean isCreateSessionAllowed()
	{
		return createSessionAllowed;
	}

	protected PortResolver getPortResolver()
	{
		return portResolver;
	}

	protected RequestMatcher getRequestMatcher()
	{
		return requestMatcher;
	}

	@Override
	public HttpServletRequest getMatchingRequest(final HttpServletRequest request, final HttpServletResponse response)
	{
		HttpServletRequest result = super.getMatchingRequest(request, response);
		if (result != null)
		{
			result = new CookieMergingHttpServletRequestWrapper(result, request);
		}
		return result;
	}

	protected String calculateRelativeRedirectUrl(final String contextPath, final String url)
	{
		if (UrlUtils.isAbsoluteUrl(url))
		{
			String relUrl = url.substring(url.indexOf("://") + 3);
			String modifiedContextPath = StringUtils.isNotEmpty(contextPath) ? contextPath : "/";
			final String urlEncodingAttributes = getSessionService().getAttribute(WebConstants.URL_ENCODING_ATTRIBUTES);
			if (urlEncodingAttributes != null && !url.contains(urlEncodingAttributes)
					&& modifiedContextPath.contains(urlEncodingAttributes))
			{
				modifiedContextPath = StringUtils.remove(modifiedContextPath, urlEncodingAttributes);
			}

			relUrl = relUrl.substring(relUrl.indexOf(modifiedContextPath) + modifiedContextPath.length());

			return StringUtils.isEmpty(relUrl) ? "/" : relUrl;
		}
		else
		{
			return url;
		}
	}

	private class RedirectAwareSavedRequest extends DefaultSavedRequest
	{
		private final String referer;
		private final String contextPath;

		public RedirectAwareSavedRequest(final HttpServletRequest request, final PortResolver portResolverh)
		{
			super(request, portResolver);
			this.referer = request.getHeader(REFERER);
			this.contextPath = request.getContextPath();
		}

		@Override
		public String getRedirectUrl()
		{
			return calculateRelativeRedirectUrl(contextPath, referer);
		}
	}
}
