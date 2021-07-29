/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.flow.impl.SessionOverrideCheckoutFlowFacade;
import de.hybris.platform.acceleratorservices.controllers.page.PageType;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractCheckoutController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.ConsentForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.GuestRegisterForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.GuestRegisterValidator;
import de.hybris.platform.acceleratorstorefrontcommons.security.AutoLoginStrategy;
import de.hybris.platform.commercefacades.consent.CustomerConsentDataStrategy;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.consent.ConsentFacade;
import de.hybris.platform.commercefacades.consent.data.AnonymousConsentData;
import de.hybris.platform.commercefacades.coupon.data.CouponData;
import de.hybris.platform.commercefacades.order.CheckoutFacade;
import de.hybris.platform.commercefacades.order.OrderFacade;
import de.hybris.platform.commercefacades.order.data.OrderData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.customer.DuplicateUidException;
import de.hybris.platform.commerceservices.util.ResponsiveUtils;
import de.hybris.platform.servicelayer.exceptions.ModelNotFoundException;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.util.WebUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_GIVEN;



/**
 * CheckoutController
 */
@Controller
@RequestMapping(value = "/checkout")
public class CheckoutController extends AbstractCheckoutController
{
	private static final Logger LOG = Logger.getLogger(CheckoutController.class);
	/**
	 * We use this suffix pattern because of an issue with Spring 3.1 where a Uri value is incorrectly extracted if it
	 * contains on or more '.' characters. Please see https://jira.springsource.org/browse/SPR-6164 for a discussion on the
	 * issue and future resolution.
	 */
	private static final String ORDER_CODE_PATH_VARIABLE_PATTERN = "{orderCode:.*}";

	private static final String CHECKOUT_ORDER_CONFIRMATION_CMS_PAGE_LABEL = "orderConfirmation";
	private static final String CONTINUE_URL_KEY = "continueUrl";
	private static final String CONSENT_FORM_GLOBAL_ERROR = "consent.form.global.error";

	@Resource(name = "productFacade")
	private ProductFacade productFacade;

	@Resource(name = "orderFacade")
	private OrderFacade orderFacade;

	@Resource(name = "checkoutFacade")
	private CheckoutFacade checkoutFacade;

	@Resource(name = "guestRegisterValidator")
	private GuestRegisterValidator guestRegisterValidator;

	@Resource(name = "autoLoginStrategy")
	private AutoLoginStrategy autoLoginStrategy;

	@Resource(name = "consentFacade")
	protected ConsentFacade consentFacade;

	@Resource(name = "customerConsentDataStrategy")
	protected CustomerConsentDataStrategy customerConsentDataStrategy;

	@ExceptionHandler(ModelNotFoundException.class)
	public String handleModelNotFoundException(final ModelNotFoundException exception, final HttpServletRequest request)
	{
		request.setAttribute("message", exception.getMessage());
		return FORWARD_PREFIX + "/404";
	}

	@RequestMapping(method = RequestMethod.GET)
	public String checkout(final RedirectAttributes redirectModel)
	{
		if (getCheckoutFlowFacade().hasValidCart())
		{
			if (validateCart(redirectModel))
			{
				return REDIRECT_PREFIX + "/cart";
			}
			else
			{
				checkoutFacade.prepareCartForCheckout();
				return getCheckoutRedirectUrl();
			}
		}

		LOG.info("Missing, empty or unsupported cart");

		// No session cart or empty session cart. Bounce back to the cart page.
		return REDIRECT_PREFIX + "/cart";
	}

	@RequestMapping(value = "/orderConfirmation/" + ORDER_CODE_PATH_VARIABLE_PATTERN, method = RequestMethod.GET)
	@RequireHardLogIn
	public String orderConfirmation(@PathVariable("orderCode") final String orderCode, final HttpServletRequest request,
			final Model model, final RedirectAttributes redirectModel) throws CMSItemNotFoundException
	{
		SessionOverrideCheckoutFlowFacade.resetSessionOverrides();
		return processOrderCode(orderCode, model, request, redirectModel);
	}


	@RequestMapping(value = "/orderConfirmation/" + ORDER_CODE_PATH_VARIABLE_PATTERN, method = RequestMethod.POST)
	public String orderConfirmation(final GuestRegisterForm form, final BindingResult bindingResult, final Model model,
			final HttpServletRequest request, final HttpServletResponse response, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException
	{
		getGuestRegisterValidator().validate(form, bindingResult);
		return processRegisterGuestUserRequest(form, bindingResult, model, request, response, redirectModel);
	}

	protected String processRegisterGuestUserRequest(final GuestRegisterForm form, final BindingResult bindingResult,
			final Model model, final HttpServletRequest request, final HttpServletResponse response,
			final RedirectAttributes redirectModel) throws CMSItemNotFoundException
	{
		if (bindingResult.hasErrors())
		{
			form.setTermsCheck(false);
			GlobalMessages.addErrorMessage(model, "form.global.error");
			return processOrderCode(form.getOrderCode(), model, request, redirectModel);
		}
		try
		{
			getCustomerFacade().changeGuestToCustomer(form.getPwd(), form.getOrderCode());
			getAutoLoginStrategy().login(getCustomerFacade().getCurrentCustomer().getUid(), form.getPwd(), request, response);
			getSessionService().removeAttribute(WebConstants.ANONYMOUS_CHECKOUT);
		}
		catch (final DuplicateUidException e)
		{
			// User already exists
			LOG.debug("guest registration failed.");
			form.setTermsCheck(false);
			model.addAttribute(new GuestRegisterForm());
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"guest.checkout.existingaccount.register.error", new Object[]
					{ form.getUid() });
			return REDIRECT_PREFIX + request.getHeader("Referer");
		}

		// Consent form data
		try
		{
			final ConsentForm consentForm = form.getConsentForm();
			if (consentForm != null && consentForm.getConsentGiven())
			{
				getConsentFacade().giveConsent(consentForm.getConsentTemplateId(), consentForm.getConsentTemplateVersion());
			}
		}
		catch (final Exception e)
		{
			LOG.error("Error occurred while creating consents during registration", e);
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, CONSENT_FORM_GLOBAL_ERROR);
		}

		// save anonymous-consent cookies as ConsentData
		final Cookie cookie = WebUtils.getCookie(request, WebConstants.ANONYMOUS_CONSENT_COOKIE);
		if (cookie != null)
		{
			try
			{
				final ObjectMapper mapper = new ObjectMapper();
				final List<AnonymousConsentData> anonymousConsentDataList = Arrays.asList(mapper.readValue(
						URLDecoder.decode(cookie.getValue(), StandardCharsets.UTF_8.displayName()), AnonymousConsentData[].class));
				anonymousConsentDataList.stream().filter(consentData -> CONSENT_GIVEN.equals(consentData.getConsentState()))
						.forEach(consentData -> consentFacade.giveConsent(consentData.getTemplateCode(),
								Integer.valueOf(consentData.getTemplateVersion())));
			}
			catch (final UnsupportedEncodingException e)
			{
				LOG.error(String.format("Cookie Data could not be decoded : %s", cookie.getValue()), e);
			}
			catch (final IOException e)
			{
				LOG.error("Cookie Data could not be mapped into the Object", e);
			}
			catch (final Exception e)
			{
				LOG.error("Error occurred while creating Anonymous cookie consents", e);
			}
		}

		customerConsentDataStrategy.populateCustomerConsentDataInSession();

		return REDIRECT_PREFIX + "/";
	}

	protected String processOrderCode(final String orderCode, final Model model, final HttpServletRequest request,
			final RedirectAttributes redirectModel) throws CMSItemNotFoundException
	{
		final OrderData orderDetails;

		try
		{
			orderDetails = orderFacade.getOrderDetailsForCode(orderCode);
		}
		catch (final UnknownIdentifierException e)
		{
			LOG.warn("Attempted to load an order confirmation that does not exist or is not visible. Redirect to home page.");
			return REDIRECT_PREFIX + ROOT;
		}

		addRegistrationConsentDataToModel(model);

		if (orderDetails.isGuestCustomer() && !StringUtils.substringBefore(orderDetails.getUser().getUid(), "|")
				.equals(getSessionService().getAttribute(WebConstants.ANONYMOUS_CHECKOUT_GUID)))
		{
			return getCheckoutRedirectUrl();
		}

		if (orderDetails.getEntries() != null && !orderDetails.getEntries().isEmpty())
		{
			for (final OrderEntryData entry : orderDetails.getEntries())
			{
				final String productCode = entry.getProduct().getCode();
				final ProductData product = productFacade.getProductForCodeAndOptions(productCode,
						Arrays.asList(ProductOption.BASIC, ProductOption.PRICE, ProductOption.CATEGORIES));
				entry.setProduct(product);
			}
		}

		model.addAttribute("orderCode", orderCode);
		model.addAttribute("orderData", orderDetails);
		model.addAttribute("allItems", orderDetails.getEntries());
		model.addAttribute("deliveryAddress", orderDetails.getDeliveryAddress());
		model.addAttribute("deliveryMode", orderDetails.getDeliveryMode());
		model.addAttribute("paymentInfo", orderDetails.getPaymentInfo());
		model.addAttribute("pageType", PageType.ORDERCONFIRMATION.name());

		final List<CouponData> giftCoupons = orderDetails.getAppliedOrderPromotions().stream()
				.filter(x -> CollectionUtils.isNotEmpty(x.getGiveAwayCouponCodes())).flatMap(p -> p.getGiveAwayCouponCodes().stream())
				.collect(Collectors.toList());
		model.addAttribute("giftCoupons", giftCoupons);

		processEmailAddress(model, orderDetails);

		final String continueUrl = (String) getSessionService().getAttribute(WebConstants.CONTINUE_URL);
		model.addAttribute(CONTINUE_URL_KEY, (continueUrl != null && !continueUrl.isEmpty()) ? continueUrl : ROOT);

		final ContentPageModel checkoutOrderConfirmationPage = getContentPageForLabelOrId(CHECKOUT_ORDER_CONFIRMATION_CMS_PAGE_LABEL);
		storeCmsPageInModel(model, checkoutOrderConfirmationPage);
		setUpMetaDataForContentPage(model, checkoutOrderConfirmationPage);
		model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);

		if (ResponsiveUtils.isResponsive())
		{
			return getViewForPage(model);
		}

		return ControllerConstants.Views.Pages.Checkout.CheckoutConfirmationPage;
	}

	protected void processEmailAddress(final Model model, final OrderData orderDetails)
	{
		final String uid;

		if (orderDetails.isGuestCustomer() && !model.containsAttribute("guestRegisterForm"))
		{
			final GuestRegisterForm guestRegisterForm = new GuestRegisterForm();
			guestRegisterForm.setOrderCode(orderDetails.getGuid());
			uid = orderDetails.getPaymentInfo().getBillingAddress().getEmail();
			guestRegisterForm.setUid(uid);
			model.addAttribute(guestRegisterForm);
		}
		else
		{
			uid = orderDetails.getUser().getUid();
		}
		model.addAttribute("email", uid);
	}

	protected GuestRegisterValidator getGuestRegisterValidator()
	{
		return guestRegisterValidator;
	}

	protected AutoLoginStrategy getAutoLoginStrategy()
	{
		return autoLoginStrategy;
	}

}
