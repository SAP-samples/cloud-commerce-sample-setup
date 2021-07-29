/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.apache.log4j.Logger;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.common.base.Stopwatch;


/**
 * A filter that logs each request. This is a spring configured filter that is executed by the PlatformFilterChain.
 */
public class RequestLoggerFilter extends OncePerRequestFilter
{
	private static final Logger LOG = Logger.getLogger(RequestLoggerFilter.class.getName());

	@Override
	public void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws IOException, ServletException
	{
		if (LOG.isDebugEnabled())
		{
			final String requestDetails = buildRequestDetails(request);
			writeDebugLog(requestDetails, "Begin");
			logCookies(request);

			final ResponseWrapper wrappedResponse = new ResponseWrapper(response);

			final Stopwatch stopwatch = Stopwatch.createUnstarted();
			stopwatch.start();
			try
			{
				filterChain.doFilter(request, wrappedResponse);
			}
			finally
			{
				stopwatch.stop();
				final int status = wrappedResponse.getStatus();

				if (status != 0)
				{
					writeDebugLog(requestDetails, stopwatch.toString(), " (", String.valueOf(status), ")");
				}
				else
				{
					writeDebugLog(requestDetails, stopwatch.toString());
				}
			}

			return;
		}

		filterChain.doFilter(request, response);
	}

	protected void logCookies(final HttpServletRequest httpRequest)
	{
		if (LOG.isDebugEnabled())
		{
			final Cookie[] cookies = httpRequest.getCookies();
			if (cookies != null)
			{
				for (final Cookie cookie : cookies)
				{
					writeDebugLog("COOKIE Name: [", cookie.getName(), "] Path: [", cookie.getPath(), "] Value: [", cookie.getValue(),
							"]");
				}
			}
		}
	}

	protected void writeDebugLog(final String... messages)
	{
		if (LOG.isDebugEnabled())
		{
			LOG.debug(String.join(" ", messages));
		}
	}

	protected String buildRequestDetails(final HttpServletRequest request)
	{
		String queryString = request.getQueryString();
		if (queryString == null)
		{
			queryString = "";
		}

		final String requestUri = request.getRequestURI();

		final String securePrefix = request.isSecure() ? "s" : " ";
		final String methodPrefix = request.getMethod().substring(0, 1);

		return securePrefix + methodPrefix + " [" + requestUri + "] [" + queryString + "] ";
	}

	protected static class ResponseWrapper extends HttpServletResponseWrapper
	{
		private int status;

		public ResponseWrapper(final HttpServletResponse response)
		{
			super(response);
		}

		@Override
		public void setStatus(final int status)
		{
			super.setStatus(status);
			this.status = status;
		}

		@Override
		public int getStatus()
		{
			return status;
		}

		@Override
		public void sendError(final int status, final String msg) throws IOException
		{
			super.sendError(status, msg); // NOSONAR
			this.status = status;
		}

		@Override
		public void sendError(final int status) throws IOException
		{
			super.sendError(status);
			this.status = status;
		}
	}
}
