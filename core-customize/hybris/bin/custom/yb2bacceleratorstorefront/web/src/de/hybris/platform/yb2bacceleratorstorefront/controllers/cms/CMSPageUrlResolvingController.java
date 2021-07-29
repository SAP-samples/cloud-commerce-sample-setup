/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.AbstractController;
import de.hybris.platform.cms2.constants.Cms2Constants;
import de.hybris.platform.cms2.model.preview.CMSPreviewTicketModel;
import de.hybris.platform.cms2.model.preview.PreviewDataModel;
import de.hybris.platform.cms2.servicelayer.services.CMSPreviewService;
import de.hybris.platform.commerceservices.url.UrlResolver;

import javax.annotation.Resource;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * Simple web service controller used in cmscockpit to resolve live URL based on cms preview ticket.
 */
@Controller("CMSPageUrlResolvingController")
@RequestMapping(value = "/" + Cms2Constants.RESOLVE_PAGE_URL_TOKEN)
public class CMSPageUrlResolvingController extends AbstractController
{
	@Resource
	private CMSPreviewService cmsPreviewService;

	@Resource(name = "previewDataModelUrlResolver")
	private UrlResolver<PreviewDataModel> resolver;


	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	@RequestMapping(method = RequestMethod.GET)
	public String resolve(@RequestParam(Cms2Constants.RESOLVE_PAGE_URL_TICKET_ID) final String cmsPageResolveTicketId)
	{
		final PreviewDataModel previewDataModel = getPreviewData(cmsPageResolveTicketId);
		return resolver.resolve(previewDataModel);
	}

	protected PreviewDataModel getPreviewData(final String ticketId)
	{
		PreviewDataModel ret = null;
		final CMSPreviewTicketModel previewTicket = cmsPreviewService.getPreviewTicket(ticketId);
		if (previewTicket != null)
		{
			ret = previewTicket.getPreviewData();
		}
		return ret;
	}
}
