/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.bootstrap.config.ExtensionInfo;
import de.hybris.platform.acceleratorservices.util.PathTraversalResourceUtils;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.util.Utilities;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.Collection;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.filter.GenericFilterBean;

import com.google.common.base.Preconditions;


public class AcceleratorAddOnFilter extends GenericFilterBean
{
	private static final Logger LOG = Logger.getLogger(AcceleratorAddOnFilter.class);

	private static final String DEFAULT_PLAIN_RESOURCE_PATTERN = "(.+)(/_ui/addons/)(.+)";
	private static final String DEFAULT_EXECUTABLE_RESOURCE_PATTERN = "((.+/)(.+)/addons/)(.+)";
	private static final String ADDON_FOLDER = "acceleratoraddon";

	public static final String ADDON_FILTER_ACTIVE_PROPERTY = "addonfilter.active";

	private ConfigurationService configurationService;
	private ExtensionAccessor extensionAccessor;

	public AcceleratorAddOnFilter()
	{
		extensionAccessor = new DefaultExtensionAccessor();
	}

	protected Collection<ResourceAddOnResolver> getAddOnResolvers()
	{
		return Arrays.asList(new PlainResourceAddOnResolver(), new ExecutableResourceAddOnResolver());
	}

	@Override
	public void doFilter(final ServletRequest req, final ServletResponse res, final FilterChain chain) throws IOException,
			ServletException
	{
		final HttpServletRequest request = (HttpServletRequest) req;
		final HttpServletResponse response = (HttpServletResponse) res;

		if (LOG.isDebugEnabled())
		{
			LOG.debug("Hit by URI  [" + request.getRequestURI() + "]");
		}
		if (isActive())
		{
			for (final ResourceAddOnResolver resolver : getAddOnResolvers())
			{
				if (resolver.supports(request))
				{
					final String sourceAddOnResource = resolver.getAddOnFullPathName(request);
					final String targetAddOnResource = resolver.getStorefrontFullPathName(request);
					copyFileInternalIfNeeded(sourceAddOnResource, targetAddOnResource);
					break;
				}
			}

		}

		chain.doFilter(request, response);
	}


	public abstract class ResourceAddOnResolver
	{
		private static final int PATH_PAYLOAD = 1;
		private static final int EXTENSION_NAME = 0;

		private final Pattern pattern;

		protected Matcher patternMatcher;

		ResourceAddOnResolver(final String patternString)
		{
			this.pattern = Pattern.compile(patternString);
		}

		public boolean supports(final HttpServletRequest request)
		{
			final String includeServletPath = (String) request.getAttribute("javax.servlet.include.servlet_path");
			if (includeServletPath != null)
			{
				patternMatcher = pattern.matcher(includeServletPath);
				if (patternMatcher.matches())
				{
					return true;
				}
			}
			patternMatcher = pattern.matcher(request.getRequestURI());
			return patternMatcher.matches();
		}

		protected abstract String[] getAddOnExtensionInfo();

		protected final String getAddOnExtensionInfoName()
		{
			return getAddOnExtensionInfo()[EXTENSION_NAME];
		}

		protected final String getAddOnExtensionInfoPayload()
		{
			return getAddOnExtensionInfo()[PATH_PAYLOAD];
		}

		abstract String getAddOnFullPathName(HttpServletRequest request);

		abstract String getStorefrontFullPathName(HttpServletRequest request);

		protected String getExtensionPath()
		{
			final String addOnExtension = getAddOnExtensionInfoName();
			return getExtensionAccessor().getExtensionDir(addOnExtension).getAbsolutePath();
		}
	}

	public class PlainResourceAddOnResolver extends ResourceAddOnResolver
	{
		private static final int EXTENSION_INFO_GROUP = 3;

		public PlainResourceAddOnResolver()
		{
			super(DEFAULT_PLAIN_RESOURCE_PATTERN);
		}

		@Override
		protected String[] getAddOnExtensionInfo()
		{
			return patternMatcher.group(EXTENSION_INFO_GROUP).split("/", 2); //first from whole request path
		}

		@Override
		public String getAddOnFullPathName(final HttpServletRequest request)
		{
			final String sourceAddOnResource = getExtensionPath();
			return sourceAddOnResource + "/" + ADDON_FOLDER + "/web/webroot/_ui/" + getAddOnExtensionInfoPayload();
		}

		@Override
		public String getStorefrontFullPathName(final HttpServletRequest request)
		{
			return getFullPathNameFromRequest(request);
		}
	}


	public class ExecutableResourceAddOnResolver extends ResourceAddOnResolver
	{
		private static final int EXTENSION_INFO_GROUP = 4;
		private static final int ADDON_ROOT_FOLDER_GROUP = 3;

		public ExecutableResourceAddOnResolver()
		{
			super(DEFAULT_EXECUTABLE_RESOURCE_PATTERN);
		}

		@Override
		protected String[] getAddOnExtensionInfo()
		{
			final String resourcePath = patternMatcher.group(EXTENSION_INFO_GROUP); //first from whole request path
			return resourcePath.split("/", 2);
		}

		@Override
		public String getAddOnFullPathName(final HttpServletRequest request)
		{
			final String sourceAddOnResource = getExtensionPath();
			final String addOnFolder = patternMatcher.group(ADDON_ROOT_FOLDER_GROUP);

			return sourceAddOnResource + "/" + ADDON_FOLDER + "/web/webroot/WEB-INF/" + addOnFolder + "/"
					+ getAddOnExtensionInfoPayload();
		}

		@Override
		public String getStorefrontFullPathName(final HttpServletRequest request)
		{
			//
			final String ctxRootDir = getAppContextFullPathNameFromRequest(request);
			final String addOnDir = patternMatcher.group(ADDON_ROOT_FOLDER_GROUP);
			final String resourcePath = patternMatcher.group(EXTENSION_INFO_GROUP);
			return ctxRootDir + "WEB-INF/" + addOnDir + "/addons/" + resourcePath;
		}
	}

	protected String getAppContextFullPathNameFromRequest(final HttpServletRequest request)
	{
		return request.getServletContext().getRealPath("/");
	}

	protected String getFullPathNameFromRequest(final HttpServletRequest request)
	{
		final String ctxPath = request.getContextPath();
		String requestUri = request.getRequestURI();

		if (requestUri.startsWith(ctxPath))
		{
			requestUri = requestUri.substring(ctxPath.length());
		}

		return FilenameUtils.normalize(request.getServletContext().getRealPath(requestUri), true);
	}

	/**
	 * Copies file @param sourceAddOnFileName to @param targetWebAddOnFileName if it is older. Creates a directory
	 * structure if needed.
	 *
	 * @param sourceAddOnFileName
	 * @param targetWebAddOnFileName
	 * @throws IOException
	 */
	protected void copyFileInternalIfNeeded(final String sourceAddOnFileName, final String targetWebAddOnFileName)
			throws IOException
	{
		PathTraversalResourceUtils.assertPathSegmentIsSecure(sourceAddOnFileName);
		PathTraversalResourceUtils.assertPathSegmentIsSecure(targetWebAddOnFileName);

		final File sourceAddOnFile = new File(sourceAddOnFileName);
		final File targetAddOnFile = new File(targetWebAddOnFileName);

		if (!sourceAddOnFile.exists())
		{
			LOG.warn("Add-on source file [" + sourceAddOnFileName + "] should exists ");
			return;
		}
		if (!targetAddOnFile.exists())
		{
			try
			{
				FileUtils.forceMkdir(targetAddOnFile.getParentFile());
			}
			catch (final IOException e)
			{
				LOG.info("Unable to create addon folder for resource " + targetAddOnFile.getParent()
						+ " please rebuild platform for relocating add-ons");
				if (LOG.isDebugEnabled())
				{
					LOG.debug(e);
				}
			}
			FileUtils.copyFile(sourceAddOnFile, targetAddOnFile);
		}
		else
		{
			if (FileUtils.isFileOlder(targetAddOnFile, sourceAddOnFile))
			{
				LOG.info("Copying <<" + sourceAddOnFile.getAbsolutePath() + ">> to <<" + targetAddOnFile.getAbsolutePath() + ">>.");
				FileUtils.copyFile(sourceAddOnFile, targetAddOnFile);
			}
		}
	}


	protected ConfigurationService getConfigurationService()
	{
		return configurationService;
	}

	protected boolean isActive()
	{
		return getConfigurationService().getConfiguration().getBoolean(ADDON_FILTER_ACTIVE_PROPERTY, false);
	}

	@Required
	public void setConfigurationService(final ConfigurationService configurationService)
	{
		this.configurationService = configurationService;
		if (isActive())
		{
			LOG.info(" *** ATTENTION: AcceleratorAddOnFilter is enabled, and will have a significant impact on performance on a production system. ***");
		}
	}

	//Utilities abstraction

	protected ExtensionAccessor getExtensionAccessor()
	{
		return extensionAccessor;
	}

	public void setExtensionAccessor(final ExtensionAccessor extensionAccessor)
	{
		this.extensionAccessor = extensionAccessor;
	}

	public interface ExtensionAccessor
	{
		File getExtensionDir(String extensionName);

		String getAllRequiredExtensionsString(String extensionName);

		Collection<String> getAllExtensionNames();

		Collection<String> getAllWebModulesNames();
	}


	public static class DefaultExtensionAccessor implements ExtensionAccessor
	{
		@Override
		public File getExtensionDir(final String extensionName)
		{
			return getInfo(extensionName).getExtensionDirectory();
		}

		protected ExtensionInfo getInfo(final String extensionName)
		{
			final ExtensionInfo info = Utilities.getExtensionInfo(extensionName);
			Preconditions.checkNotNull(info, "Missing extension info for given extension name " + extensionName);
			return info;
		}

		@Override
		public String getAllRequiredExtensionsString(final String extensionName)
		{
			return getInfo(extensionName).getAllRequiredExtensionsString();
		}

		@Override
		public Collection<String> getAllExtensionNames()
		{
			return Utilities.getExtensionNames();
		}

		@Override
		public Collection<String> getAllWebModulesNames()
		{
			return Utilities.getInstalledWebModules().keySet();
		}
	}

}
