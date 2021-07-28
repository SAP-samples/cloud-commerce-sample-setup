/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.platform.core.Registry;
import de.hybris.platform.util.config.ConfigIntf;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;


/**
 * Filter which allows us to bypass all of the spring filters for requests to a given path.
 * This is a simple servlet filter. It is intended to be used to serve static resources from the
 * web application. I can be used early in the filter chain to bypass any spring setup or hybris
 * session setup for the static resources.
 */
public class StaticResourceFilter implements Filter
{
	private static final String COMMON_DEFAULT_SERVLET_NAME = "default";
	private static final String GAE_DEFAULT_SERVLET_NAME = "_ah_default";
	private static final String RESIN_DEFAULT_SERVLET_NAME = "resin-file";
	private static final String WEBLOGIC_DEFAULT_SERVLET_NAME = "FileServlet";
	private static final String WEBSPHERE_DEFAULT_SERVLET_NAME = "SimpleFileServlet";

	private static final String HEADER_PROPERTIES_PREFIX = "storefront.staticResourceFilter.response.header.";

	/**
	 * Lazy loaded map which contains the http header parameters defined in the *.properties. The String
	 * "storefront.staticResourceFilter.response.header." will be removed from the key, the remaining is added to this map.
	 */
	private Map<String, String> headerParams = null;

	private ConfigIntf.ConfigChangeListener cfgChangeListener;

	private RequestDispatcher defaultRequestDispatcher;

	protected RequestDispatcher getDefaultRequestDispatcher()
	{
		return defaultRequestDispatcher;
	}

	@Override
	public void init(final FilterConfig filterConfig) throws ServletException
	{
		final ServletContext servletContext = filterConfig.getServletContext();

		// Try and work out the default RequestDispatcher for common servlet containers
		if (servletContext.getNamedDispatcher(COMMON_DEFAULT_SERVLET_NAME) != null)
		{
			this.defaultRequestDispatcher = servletContext.getNamedDispatcher(COMMON_DEFAULT_SERVLET_NAME);
		}
		else if (servletContext.getNamedDispatcher(GAE_DEFAULT_SERVLET_NAME) != null)
		{
			this.defaultRequestDispatcher = servletContext.getNamedDispatcher(GAE_DEFAULT_SERVLET_NAME);
		}
		else if (servletContext.getNamedDispatcher(RESIN_DEFAULT_SERVLET_NAME) != null)
		{
			this.defaultRequestDispatcher = servletContext.getNamedDispatcher(RESIN_DEFAULT_SERVLET_NAME);
		}
		else if (servletContext.getNamedDispatcher(WEBLOGIC_DEFAULT_SERVLET_NAME) != null)
		{
			this.defaultRequestDispatcher = servletContext.getNamedDispatcher(WEBLOGIC_DEFAULT_SERVLET_NAME);
		}
		else if (servletContext.getNamedDispatcher(WEBSPHERE_DEFAULT_SERVLET_NAME) != null)
		{
			this.defaultRequestDispatcher = servletContext.getNamedDispatcher(WEBSPHERE_DEFAULT_SERVLET_NAME);
		}
		else
		{
			throw new IllegalStateException(
					"Unable to locate the default servlet for serving static content.");
		}
	}

	@Override
	public void destroy()
	{
		// Unregister the change listener if one exists
		if (cfgChangeListener != null)
		{
			Registry.getMasterTenant().getConfig().unregisterConfigChangeListener(cfgChangeListener);
		}
	}

	@Override
	public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain)
			throws IOException, ServletException
	{
		// Add any configured response headers
		readConfiguredHeaderParamsAndWriteToResponse((HttpServletResponse) response);

		// Forward to the default dispatcher for efficient file serving
		getDefaultRequestDispatcher().forward(request, response);
	}

	/**
	 * Reads the defined http header parameters from the properties into the map and writes to <code>httpResponse</code>.
	 * And also register a config change listener to get the properties changes during runtime.
	 *
	 * @throws java.io.UnsupportedEncodingException
	 *
	 */
	protected void readConfiguredHeaderParamsAndWriteToResponse(final HttpServletResponse httpResponse) throws UnsupportedEncodingException
	{
		if (headerParams == null)
		{
			// Lazily build the headers from the configuration options
			headerParams = new ConcurrentHashMap<String, String>();
			final ConfigIntf config = Registry.getMasterTenant().getConfig();

			addHeaderParamsFromConfig(config);

			// Create the change listener and register it
			cfgChangeListener = new ConfigChangeListener();
			config.registerConfigChangeListener(cfgChangeListener);
		}

		// Add any configured headers to the response
		for (final Map.Entry<String, String> param : headerParams.entrySet())
		{
			httpResponse.setHeader(param.getKey(), param.getValue());
		}
	}

	protected void addHeaderParamsFromConfig(final ConfigIntf config)
	{
		for (final String key : config.getAllParameters().keySet())
		{
			if (key.startsWith(HEADER_PROPERTIES_PREFIX))
			{
				final String headerKey = key.substring(HEADER_PROPERTIES_PREFIX.length(), key.length());
				if (!headerKey.isEmpty())
				{
					headerParams.put(headerKey, config.getParameter(key));
				}
			}
		}
	}

	protected class ConfigChangeListener implements ConfigIntf.ConfigChangeListener
	{
		@Override
		public void configChanged(final String key, final String newValue)
		{
			if (key.startsWith(HEADER_PROPERTIES_PREFIX))
			{
				final String headerKey = key.substring(HEADER_PROPERTIES_PREFIX.length(), key.length());
				if (!headerKey.isEmpty())
				{
					if (newValue == null || newValue.isEmpty())
					{
						headerParams.remove(headerKey);
					}
					else
					{
						headerParams.put(headerKey, newValue);
					}
				}
			}
		}
	}
}
