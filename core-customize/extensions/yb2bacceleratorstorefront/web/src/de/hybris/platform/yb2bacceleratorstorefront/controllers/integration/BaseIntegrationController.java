/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.integration;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.site.BaseSiteService;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;


/**
 * Base controller for all integration controllers.
 */
public class BaseIntegrationController extends AbstractController
{
	private static final Logger LOG = Logger.getLogger(BaseIntegrationController.class);

	@Resource(name = "cmsSiteService")
	protected CMSSiteService cmsSiteService;

	@Resource(name = "baseSiteService")
	protected BaseSiteService baseSiteService;

	protected void initializeSiteFromRequest(final HttpServletRequest httpRequest)
	{

		final String queryString = httpRequest.getQueryString();
		final String currentRequestURL = httpRequest.getRequestURL().toString();
		final String absoluteURL = StringUtils.removeEnd(currentRequestURL, "/")
				+ (StringUtils.isBlank(queryString) ? "" : "?" + queryString);

		try
		{

			final URL currentURL = new URL(absoluteURL);
			final CMSSiteModel cmsSiteModel = cmsSiteService.getSiteForURL(currentURL);
			if (cmsSiteModel != null)
			{
				baseSiteService.setCurrentBaseSite(cmsSiteModel, true);
			}
		}
		catch (final MalformedURLException e)
		{
			if (LOG.isDebugEnabled())
			{
				LOG.debug("Cannot find CMSSite associated with current URL ( " + absoluteURL
						+ " - check whether this is correct URL) !");
			}
		}
		catch (final CMSItemNotFoundException e)
		{
			LOG.warn("Cannot find CMSSite associated with current URL (" + absoluteURL + ")!");
			if (LOG.isDebugEnabled())
			{
				LOG.debug(e);
			}
		}
	}

	protected Map<String, String> getParameterMap(final HttpServletRequest request)
	{
		final Map<String, String> map = new HashMap<>();
		final Enumeration myEnum = request.getParameterNames();
		while (myEnum.hasMoreElements())
		{
			final String paramName = (String) myEnum.nextElement();
			final String paramValue = request.getParameter(paramName);
			map.put(paramName, paramValue);
		}
		return map;
	}
}
