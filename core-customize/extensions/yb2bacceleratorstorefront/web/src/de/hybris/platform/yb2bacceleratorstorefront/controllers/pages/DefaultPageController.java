/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.impl.ContentPageBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.util.UrlPathHelper;


/**
 * Error handler to show a CMS managed error page. This is the catch-all controller that handles all GET requests that
 * are not handled by other controllers.
 */
@Controller
public class DefaultPageController extends AbstractPageController
{
	private static final String ERROR_CMS_PAGE = "notFound";

	private final UrlPathHelper urlPathHelper = new UrlPathHelper();

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "contentPageBreadcrumbBuilder")
	private ContentPageBreadcrumbBuilder contentPageBreadcrumbBuilder;

	@RequestMapping(value = "/**", method = RequestMethod.GET)
	public String get(final Model model, final HttpServletRequest request, final HttpServletResponse response)
			throws CMSItemNotFoundException
	{
		// Check for CMS Page where label or id is like /page
		final ContentPageModel pageForRequest = getContentPageForRequest(request);
		if (pageForRequest != null)
		{
			storeCmsPageInModel(model, pageForRequest);
			setUpMetaDataForContentPage(model, pageForRequest);
			model.addAttribute(WebConstants.BREADCRUMBS_KEY, contentPageBreadcrumbBuilder.getBreadcrumbs(pageForRequest));
			return getViewForPage(pageForRequest);
		}

		// No page found - display the notFound page with error from controller
		final ContentPageModel errorPage = getContentPageForLabelOrId(ERROR_CMS_PAGE);
		storeCmsPageInModel(model, errorPage);
		setUpMetaDataForContentPage(model, errorPage);

		model.addAttribute(WebConstants.MODEL_KEY_ADDITIONAL_BREADCRUMB,
				resourceBreadcrumbBuilder.getBreadcrumbs("breadcrumb.not.found"));
		GlobalMessages.addErrorMessage(model, "system.error.page.not.found");

		response.setStatus(HttpServletResponse.SC_NOT_FOUND);

		return ControllerConstants.Views.Pages.Error.ErrorNotFoundPage;
	}

	/**
	 * Lookup the CMS Content Page for this request.
	 *
	 * @param request
	 *           The request
	 * @return the CMS content page
	 */
	protected ContentPageModel getContentPageForRequest(final HttpServletRequest request)
	{
		// Get the path for this request.
		// Note that the path begins with a '/'
		final String lookupPathForRequest = urlPathHelper.getLookupPathForRequest(request);

		try
		{
			// Lookup the CMS Content Page by label. Note that the label value must begin with a '/'.
			return getCmsPageService().getPageForLabel(lookupPathForRequest);
		}
		catch (final CMSItemNotFoundException ignore)
		{
			// Ignore exception
		}
		return null;
	}
}
