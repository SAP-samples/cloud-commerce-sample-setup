/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.order.OrderFacade;
import de.hybris.platform.commercefacades.order.data.OrderData;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * This controller handles Guest customer specific scenarios which doesn't need HTTPS requests.
 */
@Controller
@RequestMapping("/guest")
public class GuestOrderController extends AbstractPageController
{
	private static final String ORDER_GUID_PATH_VARIABLE_PATTERN = "{orderGUID:.*}";
	private static final String ORDER_DETAIL_CMS_PAGE = "order";
	private static final String REDIRECT_ORDER_EXPIRED = REDIRECT_PREFIX + "/orderExpired";
	private static final Logger LOG = Logger.getLogger(GuestOrderController.class);

	@Resource(name = "orderFacade")
	private OrderFacade orderFacade;

	@RequestMapping(value = "/order/" + ORDER_GUID_PATH_VARIABLE_PATTERN, method = RequestMethod.GET)
	public String order(@PathVariable("orderGUID") final String orderGUID, final Model model, final HttpServletResponse response)
			throws CMSItemNotFoundException
	{
		try
		{
			final ContentPageModel orderDetailPage = getContentPageForLabelOrId(ORDER_DETAIL_CMS_PAGE);
			storeCmsPageInModel(model, orderDetailPage);
			model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);
			setUpMetaDataForContentPage(model, orderDetailPage);
			final OrderData orderDetails = orderFacade.getOrderDetailsForGUID(orderGUID);
			model.addAttribute("orderData", orderDetails);
		}
		catch (final UnknownIdentifierException e)
		{
			LOG.warn("Attempted to load an order that does not exist or is not visible");
			model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);
			GlobalMessages.addErrorMessage(model, "system.error.page.not.found");
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return ControllerConstants.Views.Pages.Error.ErrorNotFoundPage;
		}
		catch (final IllegalArgumentException ae)
		{
			if (LOG.isDebugEnabled())
			{
				LOG.debug(ae);
			}
			return REDIRECT_ORDER_EXPIRED;

		}
		return ControllerConstants.Views.Pages.Guest.GuestOrderPage;
	}

}
