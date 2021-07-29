/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.impl.ContentPageBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.cms2.data.PagePreviewCriteriaData;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.AbstractPageModel;
import de.hybris.platform.cms2.model.pages.ContentPageModel;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;


/**
 * Simple CMS Content Page controller. Used only to preview CMS Pages. The DefaultPageController is used to serve
 * generic content pages.
 */
@Controller
@RequestMapping(value = "/preview-content")
public class PreviewContentPageController extends AbstractPageController
{

	@Resource(name = "contentPageBreadcrumbBuilder")
	private ContentPageBreadcrumbBuilder contentPageBreadcrumbBuilder;

	@RequestMapping(method = RequestMethod.GET, params =
	{ "uid" })
	public String get(@RequestParam(value = "uid") final String cmsPageUid, final Model model) throws CMSItemNotFoundException
	{

		final PagePreviewCriteriaData pagePreviewCriteriaData = getCmsPreviewService().getPagePreviewCriteria();

		final AbstractPageModel pageForRequest = getCmsPageService().getPageForId(cmsPageUid, pagePreviewCriteriaData);
		storeCmsPageInModel(model, pageForRequest);
		setUpMetaDataForContentPage(model, getContentPageForLabelOrId(cmsPageUid));
		model.addAttribute(WebConstants.BREADCRUMBS_KEY,
				contentPageBreadcrumbBuilder.getBreadcrumbs((ContentPageModel) pageForRequest));
		return getViewForPage(pageForRequest);
	}

}
