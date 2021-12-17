/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorfacades.email.EmailTemplateFacade;
import de.hybris.platform.acceleratorservices.email.data.EmailPageData;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.yb2bacceleratorstorefront.util.UiThemeUtils;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;


/**
 * Controller used by SmartEdit to access email templates
 */
@RestController
@RequestMapping("/emails")
public class EmailPageController extends AbstractPageController
{
	@Resource(name = "emailTemplateFacade")
	private EmailTemplateFacade emailTemplateFacade;

	@Resource(name = "uiThemeUtils")
	private UiThemeUtils uiThemeUtils;

	/**
	 * Fetch an email page view by it's UID
	 *
	 * @param request
	 *           The request
	 * @param response
	 *           The response
	 * @param modelAndView
	 *           The modelandView
	 * @param emailCmsPageUid
	 *           The page UID of the email page
	 * @return The email page view
	 * @throws CMSItemNotFoundException
	 *            If the page UID is not valid
	 */
	@GetMapping(value = "/{emailCmsPageUid}", produces = MediaType.TEXT_HTML_VALUE)
	public String get(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView,
			@PathVariable final String emailCmsPageUid) throws CMSItemNotFoundException
	{
		final List<String> jsPaths = uiThemeUtils.getSmartEditAddOnJSPaths(request);
		final List<String> cssPaths = uiThemeUtils.getSmartEditAddOnCSSPaths(request);

		final EmailPageData emailPageData = new EmailPageData();
		emailPageData.setPageUid(emailCmsPageUid);
		emailPageData.setJsPaths(jsPaths);
		emailPageData.setCssPaths(cssPaths);
		return emailTemplateFacade.getPageTemplate(emailPageData);
	}

}
