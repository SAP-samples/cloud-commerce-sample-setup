/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforecontroller;

import de.hybris.platform.acceleratorcms.services.CMSPageContextService;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeControllerHandler;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.cms.EmailPageController;

import java.io.IOException;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.method.HandlerMethod;


/**
 * The SecurityEmailCheckBeforeControllerHandler class exists to make sure that email pages are only viewable in a CMS
 * context, and not by a regular user.
 */
public class SecurityEmailCheckBeforeControllerHandler implements BeforeControllerHandler
{
	@Resource(name = "cmsPageContextService")
	private CMSPageContextService cmsPageContextService;

	/**
	 * Check if the page being requested is an Email page, and if so, only aloow it if there is a valid preview model.
	 * This way we can ensure that public, or normal users will never be able to render email pages. If someone tries to
	 * access an email page without a preview, simply redirect to the default page.
	 *
	 * @return False if the requested mapge is an email page, and there is no valid preview data.
	 */
	@Override
	public boolean beforeController(final HttpServletRequest request, final HttpServletResponse response,
			final HandlerMethod handler) throws IOException
	{

		// regular users should not be able to access email pages
		// so we make sure there's a valid preview data for anyone access email
		if (!isPreviewDataModelValid(request)
				&& EmailPageController.class.isAssignableFrom(handler.getMethod().getDeclaringClass()))
		{
			// redirect to default page to avoid empty page
			response.sendRedirect(response.encodeRedirectURL(request.getContextPath() + "/")); //NOSONAR
			return false;
		}

		return true;
	}

	/**
	 * Delegate to {@link CMSPageContextService} to see if the request contains valid preview data.
	 *
	 * @param httpRequest
	 *           An http request
	 * @return True if the request contains valid cms preview data
	 */
	protected boolean isPreviewDataModelValid(final HttpServletRequest httpRequest)
	{
		return cmsPageContextService.getCmsPageRequestContextData(httpRequest).getPreviewData() != null;
	}
}
