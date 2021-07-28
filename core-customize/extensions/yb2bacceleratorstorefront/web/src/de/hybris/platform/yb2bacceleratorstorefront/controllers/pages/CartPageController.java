/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.cart.action.CartEntryAction;
import de.hybris.platform.acceleratorfacades.cart.action.CartEntryActionFacade;
import de.hybris.platform.acceleratorfacades.cart.action.exceptions.CartEntryActionException;
import de.hybris.platform.acceleratorfacades.csv.CsvFacade;
import de.hybris.platform.acceleratorfacades.flow.impl.SessionOverrideCheckoutFlowFacade;
import de.hybris.platform.acceleratorservices.controllers.page.PageType;
import de.hybris.platform.acceleratorservices.enums.CheckoutFlowEnum;
import de.hybris.platform.acceleratorservices.enums.CheckoutPciOptionEnum;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractCartPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.SaveCartForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdateQuantityForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.VoucherForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.SaveCartFormValidator;
import de.hybris.platform.acceleratorstorefrontcommons.util.XSSFilterUtil;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.order.SaveCartFacade;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.commercefacades.order.data.CartModificationData;
import de.hybris.platform.commercefacades.order.data.CommerceSaveCartParameterData;
import de.hybris.platform.commercefacades.order.data.CommerceSaveCartResultData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commercefacades.quote.data.QuoteData;
import de.hybris.platform.commercefacades.voucher.VoucherFacade;
import de.hybris.platform.commercefacades.voucher.exceptions.VoucherOperationException;
import de.hybris.platform.commerceservices.order.CommerceCartModificationException;
import de.hybris.platform.commerceservices.order.CommerceSaveCartException;
import de.hybris.platform.commerceservices.security.BruteForceAttackHandler;
import de.hybris.platform.core.enums.QuoteState;
import de.hybris.platform.enumeration.EnumerationService;
import de.hybris.platform.site.BaseSiteService;
import de.hybris.platform.util.Config;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StreamUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


/**
 * Controller for cart page
 */
@Controller
@RequestMapping(value = "/cart")
public class CartPageController extends AbstractCartPageController
{
	public static final String SHOW_CHECKOUT_STRATEGY_OPTIONS = "storefront.show.checkout.flows";
	public static final String ERROR_MSG_TYPE = "errorMsg";
	public static final String SUCCESSFUL_MODIFICATION_CODE = "success";
	public static final String VOUCHER_FORM = "voucherForm";
	public static final String SITE_QUOTES_ENABLED = "site.quotes.enabled.";
	private static final String CART_CHECKOUT_ERROR = "cart.checkout.error";

	private static final String ACTION_CODE_PATH_VARIABLE_PATTERN = "{actionCode:.*}";

	private static final String REDIRECT_CART_URL = REDIRECT_PREFIX + "/cart";
	private static final String REDIRECT_QUOTE_EDIT_URL = REDIRECT_PREFIX + "/quote/%s/edit/";
	private static final String REDIRECT_QUOTE_VIEW_URL = REDIRECT_PREFIX + "/my-account/my-quotes/%s/";

	private static final Logger LOG = Logger.getLogger(CartPageController.class);

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "enumerationService")
	private EnumerationService enumerationService;

	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;

	@Resource(name = "saveCartFacade")
	private SaveCartFacade saveCartFacade;

	@Resource(name = "saveCartFormValidator")
	private SaveCartFormValidator saveCartFormValidator;

	@Resource(name = "csvFacade")
	private CsvFacade csvFacade;

	@Resource(name = "voucherFacade")
	private VoucherFacade voucherFacade;

	@Resource(name = "baseSiteService")
	private BaseSiteService baseSiteService;

	@Resource(name = "cartEntryActionFacade")
	private CartEntryActionFacade cartEntryActionFacade;

	@Resource(name = "bruteForceAttackHandler")
	private BruteForceAttackHandler bruteForceAttackHandler;

	@ModelAttribute("showCheckoutStrategies")
	public boolean isCheckoutStrategyVisible()
	{
		return getSiteConfigService().getBoolean(SHOW_CHECKOUT_STRATEGY_OPTIONS, false);
	}

	@RequestMapping(method = RequestMethod.GET)
	public String showCart(final Model model) throws CMSItemNotFoundException
	{
		return prepareCartUrl(model);
	}

	protected String prepareCartUrl(final Model model) throws CMSItemNotFoundException
	{
		final Optional<String> quoteEditUrl = getQuoteUrl();
		if (quoteEditUrl.isPresent())
		{
			return quoteEditUrl.get();
		}
		else
		{
			prepareDataForPage(model);

			return ControllerConstants.Views.Pages.Cart.CartPage;
		}
	}

	protected Optional<String> getQuoteUrl()
	{
		final QuoteData quoteData = getCartFacade().getSessionCart().getQuoteData();

		return quoteData != null
				? (QuoteState.BUYER_OFFER.equals(quoteData.getState())
						? Optional.of(String.format(REDIRECT_QUOTE_VIEW_URL, urlEncode(quoteData.getCode())))
						: Optional.of(String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteData.getCode()))))
				: Optional.empty();
	}

	/**
	 * Handle the '/cart/checkout' request url. This method checks to see if the cart is valid before allowing the
	 * checkout to begin. Note that this method does not require the user to be authenticated and therefore allows us to
	 * validate that the cart is valid without first forcing the user to login. The cart will be checked again once the
	 * user has logged in.
	 *
	 * @return The page to redirect to
	 */
	@RequestMapping(value = "/checkout", method = RequestMethod.GET)
	@RequireHardLogIn
	public String cartCheck(final RedirectAttributes redirectModel) throws CommerceCartModificationException
	{
		SessionOverrideCheckoutFlowFacade.resetSessionOverrides();

		if (!getCartFacade().hasEntries())
		{
			LOG.info("Missing or empty cart");

			// No session cart or empty session cart. Bounce back to the cart page.
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.error.checkout.empty.cart",
					null);
			return REDIRECT_CART_URL;
		}


		if (validateCart(redirectModel))
		{
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, CART_CHECKOUT_ERROR, null);
			return REDIRECT_CART_URL;
		}

		// Redirect to the start of the checkout flow to begin the checkout process
		// We just redirect to the generic '/checkout' page which will actually select the checkout flow
		// to use. The customer is not necessarily logged in on this request, but will be forced to login
		// when they arrive on the '/checkout' page.
		return REDIRECT_PREFIX + "/checkout";
	}

	@RequestMapping(value = "/getProductVariantMatrix", method = RequestMethod.GET)
	public String getProductVariantMatrix(@RequestParam("productCode") final String productCode,
			@RequestParam(value = "readOnly", required = false, defaultValue = "false") final String readOnly, final Model model)
	{

		final ProductData productData = productFacade.getProductForCodeAndOptions(productCode,
				Arrays.asList(ProductOption.BASIC, ProductOption.CATEGORIES, ProductOption.VARIANT_MATRIX_BASE,
						ProductOption.VARIANT_MATRIX_PRICE, ProductOption.VARIANT_MATRIX_MEDIA, ProductOption.VARIANT_MATRIX_STOCK,
						ProductOption.VARIANT_MATRIX_URL));

		model.addAttribute("product", productData);
		model.addAttribute("readOnly", Boolean.valueOf(readOnly));

		return ControllerConstants.Views.Fragments.Cart.ExpandGridInCart;
	}

	// This controller method is used to allow the site to force the visitor through a specified checkout flow.
	// If you only have a static configured checkout flow then you can remove this method.
	@RequestMapping(value = "/checkout/select-flow", method = RequestMethod.GET)
	@RequireHardLogIn
	public String initCheck(final Model model, final RedirectAttributes redirectModel,
			@RequestParam(value = "flow", required = false) final String flow,
			@RequestParam(value = "pci", required = false) final String pci) throws CommerceCartModificationException
	{
		SessionOverrideCheckoutFlowFacade.resetSessionOverrides();

		if (!getCartFacade().hasEntries())
		{
			LOG.info("Missing or empty cart");

			// No session cart or empty session cart. Bounce back to the cart page.
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.error.checkout.empty.cart",
					null);
			return REDIRECT_CART_URL;
		}

		// Override the Checkout Flow setting in the session
		if (StringUtils.isNotBlank(flow))
		{
			final CheckoutFlowEnum checkoutFlow = enumerationService.getEnumerationValue(CheckoutFlowEnum.class,
					StringUtils.upperCase(flow));
			SessionOverrideCheckoutFlowFacade.setSessionOverrideCheckoutFlow(checkoutFlow);
		}

		// Override the Checkout PCI setting in the session
		if (StringUtils.isNotBlank(pci))
		{
			final CheckoutPciOptionEnum checkoutPci = enumerationService.getEnumerationValue(CheckoutPciOptionEnum.class,
					StringUtils.upperCase(pci));
			SessionOverrideCheckoutFlowFacade.setSessionOverrideSubscriptionPciOption(checkoutPci);
		}

		// Redirect to the start of the checkout flow to begin the checkout process
		// We just redirect to the generic '/checkout' page which will actually select the checkout flow
		// to use. The customer is not necessarily logged in on this request, but will be forced to login
		// when they arrive on the '/checkout' page.
		return REDIRECT_PREFIX + "/checkout";
	}

	@RequestMapping(value = "/entrygroups/{groupNumber}", method = RequestMethod.POST)
	public String removeGroup(@PathVariable("groupNumber") final Integer groupNumber, final Model model,
			final RedirectAttributes redirectModel)
	{
		final CartModificationData cartModification;
		try
		{
			cartModification = getCartFacade().removeEntryGroup(groupNumber);
			if (cartModification != null && !StringUtils.isEmpty(cartModification.getStatusMessage()))
			{
				GlobalMessages.addErrorMessage(model, cartModification.getStatusMessage());
			}
		}
		catch (final CommerceCartModificationException e)
		{
			LOG.error(e.getMessage(), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.error.entrygroup.remove",
					new Object[]
					{ groupNumber });
		}
		return REDIRECT_CART_URL;
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public String updateCartQuantities(@RequestParam("entryNumber") final long entryNumber, final Model model,
			@Valid final UpdateQuantityForm form, final BindingResult bindingResult, final HttpServletRequest request,
			final RedirectAttributes redirectModel) throws CMSItemNotFoundException
	{
		if (bindingResult.hasErrors())
		{
			for (final ObjectError error : bindingResult.getAllErrors())
			{
				if ("typeMismatch".equals(error.getCode()))
				{
					GlobalMessages.addErrorMessage(model, "basket.error.quantity.invalid");
				}
				else
				{
					GlobalMessages.addErrorMessage(model, error.getDefaultMessage());
				}
			}
		}
		else if (getCartFacade().hasEntries())
		{
			try
			{
				final CartModificationData cartModification = getCartFacade().updateCartEntry(entryNumber,
						form.getQuantity().longValue());
				addFlashMessage(form, request, redirectModel, cartModification);

				// Redirect to the cart page on update success so that the browser doesn't re-post again
				return getCartPageRedirectUrl();
			}
			catch (final CommerceCartModificationException ex)
			{
				LOG.warn("Couldn't update product with the entry number: " + entryNumber + ".", ex);
			}
		}

		// if could not update cart, display cart/quote page again with error
		return prepareCartUrl(model);
	}

	@Override
	protected void prepareDataForPage(final Model model) throws CMSItemNotFoundException
	{
		super.prepareDataForPage(model);

		if (!model.containsAttribute(VOUCHER_FORM))
		{
			model.addAttribute(VOUCHER_FORM, new VoucherForm());
		}

		// Because DefaultSiteConfigService.getProperty() doesn't set default boolean value for undefined property,
		// this property key was generated to use Config.getBoolean() method
		final String siteQuoteProperty = SITE_QUOTES_ENABLED.concat(getBaseSiteService().getCurrentBaseSite().getUid());
		model.addAttribute("siteQuoteEnabled", Config.getBoolean(siteQuoteProperty, Boolean.FALSE));
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs("breadcrumb.cart"));
		model.addAttribute("pageType", PageType.CART.name());
	}

	protected void addFlashMessage(final UpdateQuantityForm form, final HttpServletRequest request,
			final RedirectAttributes redirectModel, final CartModificationData cartModification)
	{
		if (cartModification.getQuantity() == form.getQuantity().longValue())
		{
			// Success

			if (cartModification.getQuantity() == 0)
			{
				// Success in removing entry
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "basket.page.message.remove");
			}
			else
			{
				// Success in update quantity
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "basket.page.message.update");
			}
		}
		else if (cartModification.getQuantity() > 0)
		{
			// Less than successful
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"basket.page.message.update.reducedNumberOfItemsAdded.lowStock", new Object[]
					{ XSSFilterUtil.filter(cartModification.getEntry().getProduct().getName()), Long.valueOf(cartModification.getQuantity()), form.getQuantity(), request.getRequestURL().append(cartModification.getEntry().getProduct().getUrl()) });
		}
		else
		{
			// No more stock available
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"basket.page.message.update.reducedNumberOfItemsAdded.noStock", new Object[]
					{ XSSFilterUtil.filter(cartModification.getEntry().getProduct().getName()), request.getRequestURL().append(cartModification.getEntry().getProduct().getUrl()) });
		}
	}

	@SuppressWarnings("boxing")
	@ResponseBody
	@RequestMapping(value = "/updateMultiD", method = RequestMethod.POST)
	public CartData updateCartQuantitiesMultiD(@RequestParam("entryNumber") final Integer entryNumber,
			@RequestParam("productCode") final String productCode, final Model model, @Valid final UpdateQuantityForm form,
			final BindingResult bindingResult)
	{
		if (bindingResult.hasErrors())
		{
			for (final ObjectError error : bindingResult.getAllErrors())
			{
				if ("typeMismatch".equals(error.getCode()))
				{
					GlobalMessages.addErrorMessage(model, "basket.error.quantity.invalid");
				}
				else
				{
					GlobalMessages.addErrorMessage(model, error.getDefaultMessage());
				}
			}
		}
		else
		{
			try
			{
				final CartModificationData cartModification = getCartFacade()
						.updateCartEntry(getOrderEntryData(form.getQuantity(), productCode, entryNumber));
				if (cartModification.getStatusCode().equals(SUCCESSFUL_MODIFICATION_CODE))
				{
					GlobalMessages.addMessage(model, GlobalMessages.CONF_MESSAGES_HOLDER, cartModification.getStatusMessage(), null);
				}
				else if (!model.containsAttribute(ERROR_MSG_TYPE))
				{
					GlobalMessages.addMessage(model, GlobalMessages.ERROR_MESSAGES_HOLDER, cartModification.getStatusMessage(), null);
				}
			}
			catch (final CommerceCartModificationException ex)
			{
				LOG.warn("Couldn't update product with the entry number: " + entryNumber + ".", ex);
			}

		}
		return getCartFacade().getSessionCart();
	}

	@SuppressWarnings("boxing")
	protected OrderEntryData getOrderEntryData(final long quantity, final String productCode, final Integer entryNumber)
	{
		final OrderEntryData orderEntry = new OrderEntryData();
		orderEntry.setQuantity(quantity);
		orderEntry.setProduct(new ProductData());
		orderEntry.getProduct().setCode(productCode);
		orderEntry.setEntryNumber(entryNumber);
		return orderEntry;
	}

	@RequestMapping(value = "/save", method = RequestMethod.POST)
	@RequireHardLogIn
	public String saveCart(final SaveCartForm form, final BindingResult bindingResult, final RedirectAttributes redirectModel)
			throws CommerceSaveCartException
	{
		saveCartFormValidator.validate(form, bindingResult);
		if (bindingResult.hasErrors())
		{
			for (final ObjectError error : bindingResult.getAllErrors())
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, error.getCode());
			}
			redirectModel.addFlashAttribute("saveCartForm", form);
		}
		else
		{
			final CommerceSaveCartParameterData commerceSaveCartParameterData = new CommerceSaveCartParameterData();
			commerceSaveCartParameterData.setName(form.getName());
			commerceSaveCartParameterData.setDescription(form.getDescription());
			commerceSaveCartParameterData.setEnableHooks(true);
			try
			{
				final CommerceSaveCartResultData saveCartData = saveCartFacade.saveCart(commerceSaveCartParameterData);
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "basket.save.cart.on.success",
						new Object[]
						{ saveCartData.getSavedCartData().getName() });
			}
			catch (final CommerceSaveCartException csce)
			{
				LOG.error(csce.getMessage(), csce);
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.save.cart.on.error",
						new Object[]
						{ form.getName() });
			}
		}
		return REDIRECT_CART_URL;
	}

	@RequestMapping(value = "/export", method = RequestMethod.GET, produces = "text/csv")
	public String exportCsvFile(final HttpServletResponse response, final RedirectAttributes redirectModel) throws IOException
	{
		response.setHeader("Content-Disposition", "attachment;filename=cart.csv");

		try (final StringWriter writer = new StringWriter())
		{
			try
			{
				final List<String> headers = new ArrayList<String>();
				headers.add(getMessageSource().getMessage("basket.export.cart.item.sku", null, getI18nService().getCurrentLocale()));
				headers.add(
						getMessageSource().getMessage("basket.export.cart.item.quantity", null, getI18nService().getCurrentLocale()));
				headers.add(getMessageSource().getMessage("basket.export.cart.item.name", null, getI18nService().getCurrentLocale()));
				headers
						.add(getMessageSource().getMessage("basket.export.cart.item.price", null, getI18nService().getCurrentLocale()));

				final CartData cartData = getCartFacade().getSessionCartWithEntryOrdering(false);
				csvFacade.generateCsvFromCart(headers, true, cartData, writer);

				StreamUtils.copy(writer.toString(), StandardCharsets.UTF_8, response.getOutputStream());
			}
			catch (final IOException e)
			{
				LOG.error(e.getMessage(), e);
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.export.cart.error", null);

				return REDIRECT_CART_URL;
			}

		}

		return null;
	}

	@RequestMapping(value = "/voucher/apply", method = RequestMethod.POST)
	public String applyVoucherAction(@Valid final VoucherForm form, final BindingResult bindingResult,
			final HttpServletRequest request, final RedirectAttributes redirectAttributes)
	{
		try
		{
			if (bindingResult.hasErrors())
			{
				redirectAttributes.addFlashAttribute("errorMsg",
						getMessageSource().getMessage("text.voucher.apply.invalid.error", null, getI18nService().getCurrentLocale()));
			}
			else
			{
				final String ipAddress = request.getRemoteAddr();
				if (bruteForceAttackHandler.registerAttempt(ipAddress + "_voucher"))
				{
					redirectAttributes.addFlashAttribute("disableUpdate", Boolean.valueOf(true));
					redirectAttributes.addFlashAttribute("errorMsg",
							getMessageSource().getMessage("text.voucher.apply.bruteforce.error", null, getI18nService().getCurrentLocale()));
				}
				else
				{
					voucherFacade.applyVoucher(form.getVoucherCode());
					redirectAttributes.addFlashAttribute("successMsg",
							getMessageSource().getMessage("text.voucher.apply.applied.success", new Object[]
							{ form.getVoucherCode() }, getI18nService().getCurrentLocale()));
				}
			}
		}
		catch (final VoucherOperationException e)
		{
			redirectAttributes.addFlashAttribute(VOUCHER_FORM, form);
			redirectAttributes.addFlashAttribute("errorMsg",
					getMessageSource().getMessage(e.getMessage(), null,
							getMessageSource().getMessage("text.voucher.apply.invalid.error", null, getI18nService().getCurrentLocale()),
							getI18nService().getCurrentLocale()));
			if (LOG.isDebugEnabled())
			{
				LOG.debug(e.getMessage(), e);
			}

		}

		return REDIRECT_CART_URL;
	}

	@RequestMapping(value = "/voucher/remove", method = RequestMethod.POST)
	public String removeVoucher(@Valid final VoucherForm form, final RedirectAttributes redirectModel)
	{
		try
		{
			voucherFacade.releaseVoucher(form.getVoucherCode());
		}
		catch (final VoucherOperationException e)
		{
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "text.voucher.release.error",
					new Object[]
					{ form.getVoucherCode() });
			if (LOG.isDebugEnabled())
			{
				LOG.debug(e.getMessage(), e);
			}

		}
		return REDIRECT_CART_URL;
	}

	@Override
	public BaseSiteService getBaseSiteService()
	{
		return baseSiteService;
	}

	public void setBaseSiteService(final BaseSiteService baseSiteService)
	{
		this.baseSiteService = baseSiteService;
	}

	@RequestMapping(value = "/entry/execute/" + ACTION_CODE_PATH_VARIABLE_PATTERN, method = RequestMethod.POST)
	public String executeCartEntryAction(@PathVariable(value = "actionCode", required = true) final String actionCode,
			final RedirectAttributes redirectModel, @RequestParam("entryNumbers") final Long[] entryNumbers)
	{
		CartEntryAction action = null;
		try
		{
			action = CartEntryAction.valueOf(actionCode);
		}
		catch (final IllegalArgumentException e)
		{
			LOG.error(String.format("Unknown cart entry action %s", actionCode), e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.page.entry.unknownAction");
			return getCartPageRedirectUrl();
		}

		try
		{
			final Optional<String> redirectUrl = cartEntryActionFacade.executeAction(action, Arrays.asList(entryNumbers));
			final Optional<String> successMessageKey = cartEntryActionFacade.getSuccessMessageKey(action);
			if (successMessageKey.isPresent())
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, successMessageKey.get());
			}
			if (redirectUrl.isPresent())
			{
				return redirectUrl.get();
			}
			else
			{
				return getCartPageRedirectUrl();
			}
		}
		catch (final CartEntryActionException e)
		{
			LOG.error(String.format("Failed to execute action %s", action), e);
			final Optional<String> errorMessageKey = cartEntryActionFacade.getErrorMessageKey(action);
			if (errorMessageKey.isPresent())
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, errorMessageKey.get());
			}
			return getCartPageRedirectUrl();
		}
	}

	protected String getCartPageRedirectUrl()
	{
		final QuoteData quoteData = getCartFacade().getSessionCart().getQuoteData();
		return quoteData != null ? String.format(REDIRECT_QUOTE_EDIT_URL, urlEncode(quoteData.getCode())) : REDIRECT_CART_URL;
	}

}
