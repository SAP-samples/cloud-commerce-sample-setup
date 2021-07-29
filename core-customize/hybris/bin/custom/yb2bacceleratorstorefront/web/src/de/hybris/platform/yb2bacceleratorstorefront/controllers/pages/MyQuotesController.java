/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.ordergridform.OrderGridFormFacade;
import de.hybris.platform.acceleratorfacades.product.data.ReadOnlyOrderGridData;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.Breadcrumb;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.comment.data.CommentData;
import de.hybris.platform.commercefacades.order.CartFacade;
import de.hybris.platform.commercefacades.order.QuoteFacade;
import de.hybris.platform.commercefacades.order.data.AbstractOrderData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.quote.data.QuoteData;
import de.hybris.platform.commercefacades.voucher.VoucherFacade;
import de.hybris.platform.commerceservices.enums.QuoteAction;
import de.hybris.platform.commerceservices.search.pagedata.PageableData;
import de.hybris.platform.commerceservices.search.pagedata.SearchPageData;
import de.hybris.platform.core.enums.QuoteState;
import de.hybris.platform.servicelayer.exceptions.ModelNotFoundException;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.apache.commons.collections4.CollectionUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequestMapping(value = "/my-account/my-quotes")
public class MyQuotesController extends AbstractSearchPageController
{
	private static final Logger LOG = Logger.getLogger(MyQuotesController.class);

	private static final String MY_QUOTES_CMS_PAGE = "my-quotes";
	private static final String QUOTE_DETAILS_CMS_PAGE = "quote-detail";
	private static final String REDIRECT_QUOTE_LIST_URL = REDIRECT_PREFIX + "/my-account/my-quotes/";
	private static final String REDIRECT_QUOTE_EDIT_URL = REDIRECT_PREFIX + "/quote/%s/edit/";
	private static final String PAGINATION_NUMBER_OF_COMMENTS = "quote.pagination.numberofcomments";
	private static final String ALLOWED_ACTIONS = "allowedActions";
	private static final String SYSTEM_ERROR_PAGE_NOT_FOUND = "system.error.page.not.found";
	private static final String QUOTE_CART_INSUFFICIENT_ACCESS_RIGHTS = "quote.cart.insufficient.access.rights.error";

	private static final List<QuoteState> DRAFT_STATES = Arrays.asList(QuoteState.BUYER_DRAFT, QuoteState.SELLER_DRAFT);

	@Resource(name = "accountBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder accountBreadcrumbBuilder;

	@Resource(name = "quoteFacade")
	private QuoteFacade quoteFacade;

	@Resource(name = "voucherFacade")
	private VoucherFacade voucherFacade;

	@Resource(name = "orderGridFormFacade")
	private OrderGridFormFacade orderGridFormFacade;

	@Resource(name = "cartFacade")
	private CartFacade cartFacade;

	@RequestMapping(method = RequestMethod.GET)
	@RequireHardLogIn
	public String quotes(@RequestParam(value = "page", defaultValue = "0") final int page,
			@RequestParam(value = "show", defaultValue = "Page") final ShowMode showMode,
			@RequestParam(value = "sort", defaultValue = "byDate") final String sortCode, final Model model)
			throws CMSItemNotFoundException
	{
		// Handle paged search results
		final PageableData pageableData = createPageableData(page, 5, sortCode, showMode);
		final SearchPageData searchPageData = getQuoteFacade().getPagedQuotes(pageableData);
		populateModel(model, searchPageData, showMode);

		final List<Breadcrumb> breadcrumbs = accountBreadcrumbBuilder.getBreadcrumbs(null);
		breadcrumbs.add(new Breadcrumb("/my-account/my-quotes", getMessageSource().getMessage(
				"text.account.manageQuotes.breadcrumb", null, getI18nService().getCurrentLocale()), null));
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, breadcrumbs);
		final ContentPageModel myQuotesPage = getContentPageForLabelOrId(MY_QUOTES_CMS_PAGE);
		storeCmsPageInModel(model, myQuotesPage);
		setUpMetaDataForContentPage(model, myQuotesPage);
		model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);
		return getViewForPage(model);
	}

	@RequestMapping(value = "/{quoteCode}", method = RequestMethod.GET)
	@RequireHardLogIn
	public String quote(final Model model, final RedirectAttributes redirectModel,
			@PathVariable("quoteCode") final String quoteCode) throws CMSItemNotFoundException
	{
		try
		{
			final QuoteData quoteData = getQuoteFacade().getQuoteForCode(quoteCode);

			if (Boolean.TRUE.equals(quoteData.getHasCart()) && DRAFT_STATES.contains(quoteData.getState()))
			{
				return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteData.getCode()));
			}

			model.addAttribute("quoteData", quoteData);

			loadCommentsShown(model);
			sortComments(quoteData);

			final ContentPageModel quoteDetailsPage = getContentPageForLabelOrId(QUOTE_DETAILS_CMS_PAGE);
			storeCmsPageInModel(model, quoteDetailsPage);
			setUpMetaDataForContentPage(model, quoteDetailsPage);

			setAllowedActions(model, quoteCode);

			final List<Breadcrumb> breadcrumbs = accountBreadcrumbBuilder.getBreadcrumbs(null);
			breadcrumbs.add(new Breadcrumb("/my-account/my-quotes", getMessageSource().getMessage(
					"text.account.manageQuotes.breadcrumb", null, getI18nService().getCurrentLocale()), null));
			breadcrumbs.add(new Breadcrumb("/" + urlEncode(quoteCode) + "/", getMessageSource().getMessage("breadcrumb.quote.view",
					new Object[]
					{ quoteCode }, "Quote {0}", getI18nService().getCurrentLocale()), null));
			model.addAttribute(WebConstants.BREADCRUMBS_KEY, breadcrumbs);
			model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);

			return getViewForPage(model);
		}
		catch (final UnknownIdentifierException e)
		{
			LOG.warn("Unable to load cart for quote " + quoteCode, e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, SYSTEM_ERROR_PAGE_NOT_FOUND, null);
			return REDIRECT_QUOTE_LIST_URL;
		}
		catch (final ModelNotFoundException e)
		{
			LOG.warn("Attempted to load a quote that does not exist or is not accessible by current user:" + quoteCode, e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					QUOTE_CART_INSUFFICIENT_ACCESS_RIGHTS, new Object[]
					{ getCartFacade().getSessionCart().getCode() });
			return REDIRECT_PREFIX + ROOT;
		}

	}

	@RequestMapping(value = "/{quoteCode}/getReadOnlyProductVariantMatrix", method = RequestMethod.GET)
	@RequireHardLogIn
	public String getProductVariantMatrixForResponsive(@PathVariable("quoteCode") final String quoteCode,
			@RequestParam("productCode") final String productCode, final Model model)
	{
		final QuoteData quoteData = getQuoteFacade().getQuoteForCode(quoteCode);
		final Map<String, ReadOnlyOrderGridData> readOnlyMultiDMap = orderGridFormFacade.getReadOnlyOrderGridForProductInOrder(
				productCode, Arrays.asList(ProductOption.BASIC, ProductOption.CATEGORIES), quoteData);
		model.addAttribute("readOnlyMultiDMap", readOnlyMultiDMap);

		return ControllerConstants.Views.Fragments.Checkout.ReadOnlyExpandedOrderForm;
	}

	protected void sortComments(final AbstractOrderData orderData)
	{
		if (orderData != null)
		{
			if (CollectionUtils.isNotEmpty(orderData.getComments()))
			{
				final List<CommentData> sortedComments = orderData.getComments().stream()
						.sorted((comment1, comment2) -> comment2.getCreationDate().compareTo(comment1.getCreationDate()))
						.collect(Collectors.toList());
				orderData.setComments(sortedComments);
			}

			if (CollectionUtils.isNotEmpty(orderData.getEntries()))
			{
				for (final OrderEntryData orderEntry : orderData.getEntries())
				{
					if (CollectionUtils.isNotEmpty(orderEntry.getComments()))
					{
						final List<CommentData> sortedEntryComments = orderEntry.getComments().stream()
								.sorted((comment1, comment2) -> comment2.getCreationDate().compareTo(comment1.getCreationDate()))
								.collect(Collectors.toList());

						orderEntry.setComments(sortedEntryComments);
					}
					else if (orderEntry.getProduct() != null && orderEntry.getProduct().getMultidimensional() != null
							&& orderEntry.getProduct().getMultidimensional())
					{
						if (CollectionUtils.isNotEmpty(orderEntry.getEntries()))
						{
							for (final OrderEntryData multiDOrderEntry : orderEntry.getEntries())
							{
								if (CollectionUtils.isNotEmpty(multiDOrderEntry.getComments()))
								{
									final List<CommentData> sortedMultiDOrderEntryComments = multiDOrderEntry
											.getComments()
											.stream()
											.sorted((comment1, comment2) -> comment2.getCreationDate().compareTo(comment1.getCreationDate()))
											.collect(Collectors.toList());

									multiDOrderEntry.setComments(sortedMultiDOrderEntryComments);
								}
							}
						}
					}
				}
			}
		}
	}

	protected void loadCommentsShown(final Model model)
	{
		final int commentsShown = getSiteConfigService().getInt(PAGINATION_NUMBER_OF_COMMENTS, 5);
		model.addAttribute("commentsShown", Integer.valueOf(commentsShown));
	}

	/**
	 * Set allowed actions for a given quote on model.
	 *
	 * @param model
	 *           the MVC model
	 * @param quoteCode
	 *           the quote to be checked.
	 */
	protected void setAllowedActions(final Model model, final String quoteCode)
	{
		final Set<QuoteAction> actionSet = getQuoteFacade().getAllowedActions(quoteCode);

		if (actionSet != null)
		{
			final Map<String, Boolean> actionsMap = actionSet.stream().collect(
					Collectors.toMap((v) -> v.getCode(), (v) -> Boolean.TRUE));
			model.addAttribute(ALLOWED_ACTIONS, actionsMap);
		}
	}

	protected QuoteFacade getQuoteFacade()
	{
		return quoteFacade;
	}

	public VoucherFacade getVoucherFacade()
	{
		return voucherFacade;
	}

	protected CartFacade getCartFacade()
	{
		return cartFacade;
	}
}
