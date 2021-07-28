/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractCartPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.QuoteDiscountForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.QuoteForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.VoucherForm;
import de.hybris.platform.acceleratorstorefrontcommons.tags.Functions;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.comment.data.CommentData;
import de.hybris.platform.commercefacades.order.QuoteFacade;
import de.hybris.platform.commercefacades.order.SaveCartFacade;
import de.hybris.platform.commercefacades.order.data.AbstractOrderData;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.commercefacades.order.data.CommerceCartMetadata;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.PriceDataFactory;
import de.hybris.platform.commercefacades.product.data.PriceDataType;
import de.hybris.platform.commercefacades.quote.data.QuoteData;
import de.hybris.platform.commercefacades.util.CommerceCartMetadataUtils;
import de.hybris.platform.commercefacades.voucher.VoucherFacade;
import de.hybris.platform.commercefacades.voucher.data.VoucherData;
import de.hybris.platform.commercefacades.voucher.exceptions.VoucherOperationException;
import de.hybris.platform.commerceservices.enums.QuoteAction;
import de.hybris.platform.commerceservices.order.CommerceQuoteAssignmentException;
import de.hybris.platform.commerceservices.order.CommerceQuoteExpirationTimeException;
import de.hybris.platform.commerceservices.order.exceptions.IllegalQuoteStateException;
import de.hybris.platform.commerceservices.order.exceptions.IllegalQuoteSubmitException;
import de.hybris.platform.commerceservices.order.exceptions.QuoteUnderThresholdException;
import de.hybris.platform.commerceservices.util.QuoteExpirationTimeUtils;
import de.hybris.platform.servicelayer.exceptions.ModelNotFoundException;
import de.hybris.platform.servicelayer.exceptions.ModelSavingException;
import de.hybris.platform.servicelayer.exceptions.SystemException;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.servicelayer.internal.model.impl.ItemModelCloneCreator.CannotCloneException;
import de.hybris.platform.yb2bacceleratorstorefront.util.QuoteExpirationTimeConverter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.collections.CollectionUtils;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.RequestContextUtils;


/**
 * Controller for Quotes
 */
@Controller
@RequestMapping(value = "/quote")
public class QuoteController extends AbstractCartPageController
{
	private static final String REDIRECT_CART_URL = REDIRECT_PREFIX + "/cart";
	private static final String REDIRECT_QUOTE_LIST_URL = REDIRECT_PREFIX + "/my-account/my-quotes/";
	private static final String REDIRECT_QUOTE_EDIT_URL = REDIRECT_PREFIX + "/quote/%s/edit/";
	private static final String REDIRECT_QUOTE_DETAILS_URL = REDIRECT_PREFIX + "/my-account/my-quotes/%s/";
	private static final String QUOTE_EDIT_CMS_PAGE = "quoteEditPage";
	private static final String VOUCHER_FORM = "voucherForm";
	private static final String ALLOWED_ACTIONS = "allowedActions";
	private static final String DATE_FORMAT_KEY = "text.quote.dateformat";

	// localization properties
	private static final String PAGINATION_NUMBER_OF_COMMENTS = "quote.pagination.numberofcomments";
	private static final String QUOTE_EMPTY_CART_ERROR = "quote.cart.empty.error";
	private static final String QUOTE_CREATE_ERROR = "quote.create.error";
	private static final String QUOTE_REQUOTE_ERROR = "quote.requote.error";
	private static final String QUOTE_NOT_EDITABLE_ERROR = "quote.not.editable";
	private static final String QUOTE_EDIT_LOCKED_ERROR = "quote.edit.locked";
	private static final String QUOTE_TEXT_CANCEL_SUCCESS = "text.quote.cancel.success";
	private static final String QUOTE_TEXT_NOT_CANCELABLE = "text.quote.not.cancelable";
	private static final String QUOTE_NOT_SUBMITABLE_ERROR = "text.quote.not.submitable";
	private static final String QUOTE_NEWCART_ERROR = "quote.newcart.error";
	private static final String QUOTE_NEWCART_SUCCESS = "quote.newcart.success";
	private static final String QUOTE_SAVE_CART_ERROR = "quote.save.cart.error";
	private static final String QUOTE_SUBMIT_ERROR = "quote.submit.error";
	private static final String QUOTE_SUBMIT_SUCCESS = "quote.submit.success";
	private static final String QUOTE_EXPIRED = "quote.state.expired";
	private static final String QUOTE_REJECT_INITIATION_REQUEST = "quote.reject.initiate.request";
	private static final String QUOTE_CART_INSUFFICIENT_ACCESS_RIGHTS = "quote.cart.insufficient.access.rights.error";

	private static final Logger LOG = Logger.getLogger(QuoteController.class);

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "quoteFacade")
	private QuoteFacade quoteFacade;

	@Resource(name = "voucherFacade")
	private VoucherFacade voucherFacade;

	@Resource(name = "saveCartFacade")
	private SaveCartFacade saveCartFacade;

	@Resource(name = "validator")
	private SmartValidator smartValidator;

	@Resource(name = "priceDataFactory")
	private PriceDataFactory priceDataFactory;

	/**
	 * Creates a new quote based on session cart.
	 *
	 * @param redirectModel
	 * @return Mapping to quote page.
	 */
	@RequestMapping(value = "/create", method = RequestMethod.GET)
	@RequireHardLogIn
	public String createQuote(final RedirectAttributes redirectModel)
	{
		try
		{
			if (!getCartFacade().hasEntries())
			{
				// No session cart or empty session cart. Bounce back to the cart page.
				LOG.debug("Missing or empty cart");
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_EMPTY_CART_ERROR, null);
				return REDIRECT_CART_URL;
			}

			if (validateCart(redirectModel))
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_CREATE_ERROR, null);
				return REDIRECT_CART_URL;
			}

			removeCoupons(redirectModel);

			final QuoteData quoteData = getQuoteFacade().initiateQuote();

			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteData.getCode()));
		}
		catch (final IllegalArgumentException | CannotCloneException | ModelSavingException e)
		{
			LOG.error("Unable to create quote", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_CREATE_ERROR, null);
			return REDIRECT_CART_URL;
		}
	}

	/**
	 * Removes all coupons from the client cart. To be updated in a future release.
	 *
	 * @param redirectModel
	 */
	protected void removeCoupons(final RedirectAttributes redirectModel)
	{
		final List<VoucherData> vouchers = voucherFacade.getVouchersForCart();

		for (final VoucherData voucher : vouchers)
		{
			try
			{
				voucherFacade.releaseVoucher(voucher.getCode());
			}
			catch (final VoucherOperationException e)
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "text.voucher.release.error",
						new Object[]
						{ voucher.getCode() });
				if (LOG.isDebugEnabled())
				{
					LOG.debug(e.getMessage(), e);
				}
			}
		}
	}

	/**
	 * Adds discount to an existing quote.
	 *
	 * @param quoteCode
	 *           Quote to have discounts applied.
	 * @param form
	 *           Discount info.
	 * @param redirectModel
	 * @return Mapping redirect to quote page.
	 */
	@RequestMapping(value = "{quoteCode}/discount/apply", method = RequestMethod.POST)
	@RequireHardLogIn
	public String applyDiscountAction(@PathVariable("quoteCode") final String quoteCode, @Valid final QuoteDiscountForm form,
			final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().applyQuoteDiscount(form.getDiscountRate(), form.getDiscountType());
		}
		catch (final IllegalArgumentException e)
		{
			LOG.error(String.format("Error applying discount for quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"text.quote.discount.apply.argument.invalid.error", null);
		}
		catch (final SystemException e)
		{
			LOG.error(String.format("Failed to calculate session cart when applying the discount for quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"text.quote.discount.apply.calculation.error", null);
			return REDIRECT_CART_URL;
		}

		return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode));
	}

	/**
	 * Loads quote edit page.
	 *
	 * @param model
	 * @param redirectModel
	 * @param quoteCode
	 * @return Mapping to edit page.
	 * @throws CMSItemNotFoundException
	 */
	@RequireHardLogIn
	@RequestMapping(value = "/{quoteCode}/edit", method = RequestMethod.GET)
	public String showQuoteEdit(final Model model, final RedirectAttributes redirectModel,
			@PathVariable("quoteCode") final String quoteCode) throws CMSItemNotFoundException
	{
		try
		{
			getQuoteFacade().enableQuoteEdit(quoteCode);
		}
		catch (final UnknownIdentifierException e)
		{
			LOG.warn("Attempted to load a quote that does not exist or is not editable", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_NOT_EDITABLE_ERROR,
					new Object[]
					{ quoteCode });
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		catch (final CommerceQuoteAssignmentException e)
		{
			LOG.warn("Attempted to edit a quote that is assigned to another user: " + quoteCode, e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.INFO_MESSAGES_HOLDER, QUOTE_EDIT_LOCKED_ERROR, new Object[]
			{ quoteCode, e.getAssignedUser() });
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		catch (final ModelNotFoundException e)
		{
			LOG.warn("Attempted to load a quote that does not exist or is not accessible by current user:" + quoteCode, e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					QUOTE_CART_INSUFFICIENT_ACCESS_RIGHTS, new Object[]
					{ getCartFacade().getSessionCart().getCode() });
			return REDIRECT_PREFIX + ROOT;
		}
		catch (final SystemException e)
		{
			LOG.warn("There was error saving the session cart", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_SAVE_CART_ERROR, null);
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}

		final CartData cartData = getCartFacade().getSessionCartWithEntryOrdering(false);
		prepareQuotePageElements(model, cartData, true);

		createProductEntryList(model, cartData);
		final ContentPageModel quoteEditPage = getContentPageForLabelOrId(QUOTE_EDIT_CMS_PAGE);
		storeCmsPageInModel(model, quoteEditPage);
		setUpMetaDataForContentPage(model, quoteEditPage);

		sortComments(cartData);
		continueUrl(model);
		setAllowedActions(model, quoteCode);

		model.addAttribute("exportCsvEnabled", Boolean.TRUE);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs("breadcrumb.quote.edit"));
		model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);

		final double quoteThreshold = getQuoteFacade().getQuoteRequestThreshold(quoteCode);
		if (quoteThreshold >= 0
				&& !(GlobalMessages.containsMessage(model, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_REJECT_INITIATION_REQUEST)))
		{
			// Display quote request minimum threshold only if it's set and quote version is equal to 1
			GlobalMessages.addMessage(model, GlobalMessages.INFO_MESSAGES_HOLDER, QUOTE_REJECT_INITIATION_REQUEST, new Object[]
			{ getFormattedPriceValue(quoteThreshold) });
		}

		return getViewForPage(model);
	}

	protected void fillQuoteForm(final Model model, final AbstractOrderData data)
	{
		if (!model.containsAttribute("quoteForm"))
		{
			final Locale currentLocale = getI18nService().getCurrentLocale();
			final String expirationTimePattern = getMessageSource().getMessage(DATE_FORMAT_KEY, null, currentLocale);

			final QuoteForm quoteForm = new QuoteForm();
			quoteForm.setName(data.getName());
			quoteForm.setDescription(data.getDescription());
			quoteForm.setExpirationTime(QuoteExpirationTimeConverter.convertDateToString(data.getExpirationTime(),
					expirationTimePattern, currentLocale));
			model.addAttribute("quoteForm", quoteForm);
		}
		model.addAttribute("quoteDiscountForm", new QuoteDiscountForm());
	}

	protected void fillVouchers(final Model model)
	{
		model.addAttribute("appliedVouchers", getVoucherFacade().getVouchersForCart());
		if (!model.containsAttribute(VOUCHER_FORM))
		{
			model.addAttribute(VOUCHER_FORM, new VoucherForm());
		}
	}

	protected void setUpdatable(final Model model, final CartData cartData, final boolean updatable)
	{
		for (final OrderEntryData entry : cartData.getEntries())
		{
			entry.setUpdateable(updatable);
		}

		model.addAttribute("disableUpdate", Boolean.valueOf(!updatable));
	}

	protected void setExpirationTimeAttributes(final Model model)
	{
		model.addAttribute("defaultOfferValidityPeriodDays",
				Integer.valueOf(QuoteExpirationTimeUtils.getDefaultOfferValidityPeriodDays()));
		model.addAttribute("minOfferValidityPeriodDays",
				Integer.valueOf(QuoteExpirationTimeUtils.getMinOfferValidityPeriodInDays()));
	}

	protected void prepareQuotePageElements(final Model model, final CartData cartData, final boolean updatable)
	{
		fillQuoteForm(model, cartData);
		fillVouchers(model);
		setUpdatable(model, cartData, updatable);
		loadCommentsShown(model);

		model.addAttribute("savedCartCount", saveCartFacade.getSavedCartsCountForCurrentUser());
		model.addAttribute("quoteCount", quoteFacade.getQuotesCountForCurrentUser());

		setExpirationTimeAttributes(model);
	}

	@RequestMapping(value = "/{quoteCode}/cancel", method = RequestMethod.POST)
	@RequireHardLogIn
	public String cancelQuote(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
	{
		try
		{
			quoteFacade.cancelQuote(quoteCode);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, QUOTE_TEXT_CANCEL_SUCCESS,
					new Object[]
					{ quoteCode });

		}
		catch (final UnknownIdentifierException uie)
		{
			LOG.warn("Attempted to cancel a quote that does not exist or is not visible: " + quoteCode, uie);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_TEXT_NOT_CANCELABLE,
					new Object[]
					{ quoteCode });
		}
		catch (final CommerceQuoteAssignmentException e)
		{
			LOG.warn("Attempted to cancel a quote that is assigned to another user: " + quoteCode, e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.INFO_MESSAGES_HOLDER, QUOTE_EDIT_LOCKED_ERROR, new Object[]
			{ quoteCode, e.getAssignedUser() });
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}

		return REDIRECT_QUOTE_LIST_URL;
	}

	/**
	 * Submit quote to next responsible in the workflow (e.g. from buyer to seller, from sales representative to sales
	 * approver).
	 *
	 * @param quoteCode
	 * @param redirectModel
	 * @return Mapping of redirect to the quote details page.
	 */
	@RequestMapping(value = "/{quoteCode}/submit", method = RequestMethod.POST)
	@RequireHardLogIn
	public String submitQuote(@PathVariable("quoteCode") final String quoteCode,
			@RequestParam(value = "editMode", defaultValue = "false") final boolean editMode, final QuoteForm quoteForm,
			final BindingResult bindingResult, final RedirectAttributes redirectModel)
	{
		if (validateCart(redirectModel))
		{
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_SUBMIT_ERROR, null);
			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode));
		}

		try
		{
			if (editMode)
			{
				final Optional<String> optionalUrl = handleEditModeSubmitQuote(quoteCode, quoteForm, bindingResult, redirectModel);
				if (optionalUrl.isPresent())
				{
					return optionalUrl.get();
				}
			}
			removeCoupons(redirectModel);
			getQuoteFacade().submitQuote(quoteCode);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, QUOTE_SUBMIT_SUCCESS, null);
		}
		catch (final CommerceQuoteAssignmentException cqae)
		{
			LOG.warn("Attempted to submit a quote that is assigned to another user: " + quoteCode, cqae);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.INFO_MESSAGES_HOLDER, QUOTE_EDIT_LOCKED_ERROR, new Object[]
			{ quoteCode, cqae.getAssignedUser() });
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		catch (final IllegalQuoteSubmitException e)
		{
			LOG.warn("Attempt to submit a quote that is not allowed.", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_NOT_SUBMITABLE_ERROR);
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		catch (final QuoteUnderThresholdException e)
		{
			final double quoteThreshold = getQuoteFacade().getQuoteRequestThreshold(quoteCode);
			LOG.error(String.format("Quote %s under threshold", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_REJECT_INITIATION_REQUEST,
					new Object[]
					{ getFormattedPriceValue(quoteThreshold) });
			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode));
		}
		catch (final IllegalStateException | UnknownIdentifierException | ModelSavingException | IllegalArgumentException e)
		{
			LOG.error(String.format("Unable to submit quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_SUBMIT_ERROR, null);
			return REDIRECT_PREFIX + ROOT;
		}
		return REDIRECT_QUOTE_LIST_URL;
	}

	/**
	 * Approve a quote from the sales representative
	 *
	 * @param quoteCode
	 * @param redirectModel
	 * @return Mapping of redirect to the quote details page.
	 */
	@RequestMapping(value = "/{quoteCode}/approve", method = RequestMethod.POST)
	@RequireHardLogIn
	public String approveQuote(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().approveQuote(quoteCode);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "quote.approve.success", null);
		}
		catch (final IllegalStateException | UnknownIdentifierException | ModelSavingException | IllegalArgumentException e)
		{
			LOG.error(String.format("Unable to approve quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "quote.approve.error", null);
			return REDIRECT_PREFIX + ROOT;
		}
		return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
	}

	/**
	 * Reject a quote from the sales representative
	 *
	 * @param quoteCode
	 * @param redirectModel
	 * @return Mapping of redirect to the quote details page.
	 */
	@RequestMapping(value = "/{quoteCode}/reject", method = RequestMethod.POST)
	@RequireHardLogIn
	public String rejectQuote(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().rejectQuote(quoteCode);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "quote.reject.success", null);
		}
		catch (final IllegalStateException | UnknownIdentifierException | ModelSavingException | IllegalArgumentException e)
		{
			LOG.error(String.format("Unable to reject quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "quote.reject.error", null);
			return REDIRECT_PREFIX + ROOT;
		}

		return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
	}

	@RequestMapping(value = "/{quoteCode}/requote", method = RequestMethod.POST)
	@RequireHardLogIn
	public String requote(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
	{

		try
		{
			removeCoupons(redirectModel);
			final QuoteData quoteData = getQuoteFacade().requote(quoteCode);

			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteData.getCode()));
		}
		catch (final IllegalQuoteStateException | CannotCloneException | IllegalArgumentException | ModelSavingException e)
		{
			LOG.error("Unable to requote", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_REQUOTE_ERROR, null);
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
	}

	protected Optional<String> handleEditModeSubmitQuote(final String quoteCode, final QuoteForm quoteForm,
			final BindingResult bindingResult, final RedirectAttributes redirectModel)
	{
		final boolean isSeller = Functions.isQuoteUserSalesRep();
		final Object validationGroup = isSeller ? QuoteForm.Seller.class : QuoteForm.Buyer.class;

		smartValidator.validate(quoteForm, bindingResult, validationGroup);

		if (bindingResult.hasErrors())
		{
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					isSeller ? "text.quote.expiration.time.invalid" : "text.quote.name.description.invalid", null);
			return Optional.of(String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode)));
		}

		try
		{
			CommerceCartMetadata cartMetadata;
			if (isSeller)
			{
				final Optional<Date> expirationTime = Optional.ofNullable(getExpirationDateFromString(quoteForm.getExpirationTime()));
				cartMetadata = CommerceCartMetadataUtils.metadataBuilder().expirationTime(expirationTime)
						.removeExpirationTime(!expirationTime.isPresent()).build();
			}
			else
			{
				cartMetadata = CommerceCartMetadataUtils.metadataBuilder().name(Optional.ofNullable(quoteForm.getName()))
						.description(Optional.ofNullable(quoteForm.getDescription())).build();
			}

			getCartFacade().updateCartMetadata(cartMetadata);
		}
		catch (final IllegalArgumentException e)
		{
			LOG.warn(String.format("Invalid metadata input field(s) for quote %s", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					isSeller ? "text.quote.expiration.time.invalid" : "text.quote.name.description.invalid", null);
			return Optional.of(String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode)));
		}

		return Optional.empty();
	}

	@RequestMapping(value = "/{quoteCode}/newcart", method = RequestMethod.GET)
	@RequireHardLogIn
	public String newCart(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException
	{
		try
		{
			removeCoupons(redirectModel);
			final QuoteData quoteData = quoteFacade.newCart();
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, QUOTE_NEWCART_SUCCESS, new Object[]
			{ quoteData.getCode() });
			return REDIRECT_CART_URL;
		}
		catch (final IllegalArgumentException e)
		{
			LOG.error("Unable to sync cart into quote. Illegal argument used to invoke a method", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_NEWCART_ERROR, null);
			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode));
		}
		catch (final SystemException e)
		{
			LOG.error("Unable to save quote while trying to close quote edit mode", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_NEWCART_ERROR, null);
			return String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteCode));
		}
	}

	/**
	 * Place an order for the given quote.
	 *
	 * @param quoteCode
	 * @param redirectModel
	 * @return Mapping of redirect to the checkout page.
	 */
	@RequestMapping(value = "/{quoteCode}/checkout", method = RequestMethod.POST)
	@RequireHardLogIn
	public String placeOrder(@PathVariable("quoteCode") final String quoteCode, final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().acceptAndPrepareCheckout(quoteCode);
		}
		catch (final CommerceQuoteExpirationTimeException e)
		{
			LOG.warn(String.format("Quote has Expired. Quote Code : [%s]", quoteCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_EXPIRED, null);
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		catch (final UnknownIdentifierException e)
		{
			LOG.warn(String.format("Attempted to place order with a quote that does not exist or is not visible: %s", quoteCode), e);
			return REDIRECT_QUOTE_LIST_URL;
		}
		catch (final SystemException e)
		{
			LOG.warn("There was error saving the session cart", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, QUOTE_SAVE_CART_ERROR, null);
			return String.format(REDIRECT_QUOTE_DETAILS_URL, urlEncode(quoteCode));
		}
		return getCheckoutRedirectUrl();
	}

	@ResponseBody
	@RequestMapping(value = "/{quoteCode}/expiration", method = RequestMethod.POST)
	@RequireHardLogIn
	public ResponseEntity<String> setQuoteExpiration(@PathVariable("quoteCode") final String quoteCode, final QuoteForm quoteForm,
			final BindingResult bindingResult)
	{
		smartValidator.validate(quoteForm, bindingResult, QuoteForm.Seller.class);

		if (bindingResult.hasErrors())
		{
			final String errorMessage = getMessageSource().getMessage(bindingResult.getAllErrors().get(0).getCode(), null,
					getI18nService().getCurrentLocale());
			return new ResponseEntity<String>(errorMessage, HttpStatus.BAD_REQUEST);
		}

		try
		{
			final Optional<Date> expirationTime = Optional.ofNullable(getExpirationDateFromString(quoteForm.getExpirationTime()));
			final CommerceCartMetadata cartMetadata = CommerceCartMetadataUtils.metadataBuilder().expirationTime(expirationTime)
					.removeExpirationTime(!expirationTime.isPresent()).build();

			getCartFacade().updateCartMetadata(cartMetadata);
		}
		catch (final IllegalArgumentException e)
		{
			LOG.warn(String.format("Invalid expiration time input for quote %s", quoteCode), e);
			return new ResponseEntity<String>(HttpStatus.BAD_REQUEST);
		}
		catch (final IllegalStateException | IllegalQuoteStateException | UnknownIdentifierException | ModelSavingException e)
		{
			LOG.error(String.format("Failed to update expiration time for quote %s", quoteCode), e);
			return new ResponseEntity<String>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<String>(HttpStatus.OK);
	}

	/**
	 * Update quote name and description
	 *
	 * @param quoteCode
	 * @param quoteForm
	 * @param bindingResult
	 * @return response entity
	 */
	@ResponseBody
	@RequestMapping(value = "/{quoteCode}/metadata", method = RequestMethod.POST)
	@RequireHardLogIn
	public ResponseEntity<String> setQuoteMetadata(@PathVariable("quoteCode") final String quoteCode, final QuoteForm quoteForm,
			final BindingResult bindingResult)
	{
		smartValidator.validate(quoteForm, bindingResult, QuoteForm.Buyer.class);

		if (bindingResult.hasErrors())
		{
			final String errorMessage = getMessageSource().getMessage(bindingResult.getAllErrors().get(0).getCode(), null,
					getI18nService().getCurrentLocale());
			return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
		}

		try
		{
			final Optional<String> quoteName = Optional.ofNullable(quoteForm.getName());
			final Optional<String> quoteDescription = Optional.ofNullable(quoteForm.getDescription());

			final CommerceCartMetadata cartMetadata = CommerceCartMetadataUtils.metadataBuilder().name(quoteName)
					.description(quoteDescription).build();

			getCartFacade().updateCartMetadata(cartMetadata);
		}
		catch (final IllegalArgumentException e)
		{
			LOG.warn(String.format("Invalid metadata input for quote %s", quoteCode), e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		catch (final IllegalStateException | UnknownIdentifierException | ModelSavingException e)
		{
			LOG.error(String.format("Failed to update metadata for quote %s", quoteCode), e);
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	protected Date getExpirationDateFromString(final String expirationTime)
	{
		final Locale currentLocale = getI18nService().getCurrentLocale();
		final String expirationTimePattern = getMessageSource().getMessage(DATE_FORMAT_KEY, null, currentLocale);

		return QuoteExpirationTimeConverter.convertStringToDate(expirationTime, expirationTimePattern, currentLocale);
	}

	/**
	 * Add a quote comment to a given quote.
	 *
	 * @param comment
	 * @param redirectModel
	 * @return Mapping of redirect to the quote details page.
	 */
	@RequestMapping(value = "/comment", method = RequestMethod.POST)
	@RequireHardLogIn
	public ResponseEntity<String> addQuoteComment(@RequestParam("comment") final String comment,
			final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().addComment(comment);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
					"text.confirmation.quote.comment.added");
		}
		catch (final IllegalArgumentException e)
		{
			LOG.error("Attempted to add a comment that is invalid", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/entry/comment", method = RequestMethod.POST)
	@RequireHardLogIn
	public ResponseEntity<String> addQuoteEntryComment(@RequestParam("entryNumber") final long entryNumber,
			@RequestParam("comment") final String comment, final RedirectAttributes redirectModel)
	{
		try
		{
			getQuoteFacade().addEntryComment(entryNumber, comment);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
					"text.confirmation.quote.comment.added");
		}
		catch (final IllegalArgumentException e)
		{
			LOG.error("Attempted to add an entry comment that is invalid", e);
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity<>(HttpStatus.OK);
	}

	protected void sortComments(final CartData cartData)
	{
		if (cartData != null)
		{
			if (CollectionUtils.isNotEmpty(cartData.getComments()))
			{
				final List<CommentData> sortedComments = cartData.getComments().stream()
						.sorted((comment1, comment2) -> comment2.getCreationDate().compareTo(comment1.getCreationDate()))
						.collect(Collectors.toList());
				cartData.setComments(sortedComments);
			}

			if (CollectionUtils.isNotEmpty(cartData.getEntries()))
			{
				for (final OrderEntryData orderEntry : cartData.getEntries())
				{
					if (CollectionUtils.isNotEmpty(orderEntry.getComments()))
					{
						final List<CommentData> sortedEntryComments = orderEntry.getComments().stream()
								.sorted((comment1, comment2) -> comment2.getCreationDate().compareTo(comment1.getCreationDate()))
								.collect(Collectors.toList());

						orderEntry.setComments(sortedEntryComments);
					}
					else if (orderEntry.getProduct() != null && orderEntry.getProduct().getMultidimensional() != null
							&& Boolean.TRUE.equals(orderEntry.getProduct().getMultidimensional()))
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

	@ExceptionHandler(IllegalQuoteStateException.class)
	public String handleIllegalQuoteStateException(final IllegalQuoteStateException exception, final HttpServletRequest request)
	{
		final Map<String, Object> currentFlashScope = RequestContextUtils.getOutputFlashMap(request);

		LOG.warn("Invalid quote state for performed action.", exception);

		final String statusMessageKey = String.format("text.account.quote.status.display.%s", exception.getQuoteState());
		final String actionMessageKey = String.format("text.account.quote.action.display.%s", exception.getQuoteAction());

		final String actionMessage = getMessageSource().getMessage(actionMessageKey, null, getI18nService().getCurrentLocale());
		final String statusMessage = getMessageSource().getMessage(statusMessageKey, null, getI18nService().getCurrentLocale());
		if (exception.hasLocalizedMessage())
		{
			GlobalMessages.addFlashMessage(currentFlashScope, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"text.quote.illegal.state.error.reason", new Object[]
					{ actionMessage, exception.getQuoteCode(), statusMessage, exception.getMessage() });
		}
		else
		{
			GlobalMessages.addFlashMessage(currentFlashScope, GlobalMessages.ERROR_MESSAGES_HOLDER, "text.quote.illegal.state.error",
					new Object[]
					{ actionMessage, exception.getQuoteCode(), statusMessage });
		}

		return REDIRECT_QUOTE_LIST_URL;
	}

	/**
	 * Get formatted monetary value with currency symbol
	 *
	 * @param value
	 *           the value to be formatted
	 *
	 * @return formatted threshold string
	 */
	protected String getFormattedPriceValue(final double value)
	{
		return priceDataFactory.create(PriceDataType.BUY, BigDecimal.valueOf(value), getCurrentCurrency().getIsocode())
				.getFormattedValue();
	}

	protected ResourceBreadcrumbBuilder getResourceBreadcrumbBuilder()
	{
		return resourceBreadcrumbBuilder;
	}

	protected QuoteFacade getQuoteFacade()
	{
		return quoteFacade;
	}

	protected VoucherFacade getVoucherFacade()
	{
		return voucherFacade;
	}

}
