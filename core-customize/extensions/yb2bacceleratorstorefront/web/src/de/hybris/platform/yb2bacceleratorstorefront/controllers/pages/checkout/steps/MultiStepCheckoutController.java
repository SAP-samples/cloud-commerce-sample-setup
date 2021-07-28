/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages.checkout.steps;

import de.hybris.platform.acceleratorfacades.ordergridform.OrderGridFormFacade;
import de.hybris.platform.acceleratorfacades.product.data.ReadOnlyOrderGridData;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.PreValidateCheckoutStep;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.PreValidateQuoteCheckoutStep;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.checkout.steps.CheckoutStep;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.checkout.steps.AbstractCheckoutStepController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.commercefacades.order.data.CartRestorationData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.order.CommerceCartModificationException;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import javax.annotation.Resource;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


/**
 * MultiStepCheckoutController
 */
@Controller
@RequestMapping(value = "/checkout/multi")
public class MultiStepCheckoutController extends AbstractCheckoutStepController
{
	private static final String MULTI = "multi";
	private static final String REDIRECT_CART_URL = REDIRECT_PREFIX + "/cart";

	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;

	@Resource(name = "orderGridFormFacade")
	private OrderGridFormFacade orderGridFormFacade;

	@Override
	@RequestMapping(method = RequestMethod.GET)
	@PreValidateQuoteCheckoutStep
	@PreValidateCheckoutStep(checkoutStep = MULTI)
	public String enterStep(final Model model, final RedirectAttributes redirectAttributes) throws CMSItemNotFoundException, // NOSONAR
			CommerceCartModificationException
	{
		if (validateCart(redirectAttributes))
		{
			return REDIRECT_CART_URL;
		}

		return getCheckoutStep().nextStep();
	}


	@RequestMapping(value = "/termsAndConditions", method = RequestMethod.GET)
	@RequireHardLogIn
	public String getTermsAndConditions(final Model model) throws CMSItemNotFoundException
	{
		final ContentPageModel pageForRequest = getCmsPageService().getPageForLabel("/termsAndConditions");
		storeCmsPageInModel(model, pageForRequest);
		setUpMetaDataForContentPage(model, pageForRequest);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, getContentPageBreadcrumbBuilder().getBreadcrumbs(pageForRequest));
		return ControllerConstants.Views.Fragments.Checkout.TermsAndConditionsPopup;
	}

	@RequestMapping(value = "/express", method = RequestMethod.GET)
	@RequireHardLogIn
	public String performExpressCheckout(final Model model, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException, CommerceCartModificationException // NOSONAR
	{
		if (getSessionService().getAttribute(WebConstants.CART_RESTORATION) != null && CollectionUtils.isNotEmpty(
				((CartRestorationData) getSessionService().getAttribute(WebConstants.CART_RESTORATION)).getModifications()))
		{
			return REDIRECT_URL_CART;
		}

		if (getCheckoutFlowFacade().hasValidCart())
		{
			final String result = processCart(redirectModel);
			if (result != null)
			{
				return result;
			}
		}

		return enterStep(model, redirectModel);
	}

	protected String processCart(final RedirectAttributes redirectModel)
	{
		switch (getCheckoutFacade().performExpressCheckout())
		{
			case SUCCESS:
				return REDIRECT_URL_SUMMARY;

			case ERROR_DELIVERY_ADDRESS:
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
						"checkout.express.error.deliveryAddress");
				return REDIRECT_URL_ADD_DELIVERY_ADDRESS;

			case ERROR_DELIVERY_MODE:
			case ERROR_CHEAPEST_DELIVERY_MODE:
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
						"checkout.express.error.deliveryMode");
				return REDIRECT_URL_CHOOSE_DELIVERY_METHOD;

			case ERROR_PAYMENT_INFO:
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
						"checkout.express.error.paymentInfo");
				return REDIRECT_URL_ADD_PAYMENT_METHOD;

			default:
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
						"checkout.express.error.notAvailable");
		}
		return null;
	}

	@RequestMapping(value = "/back", method = RequestMethod.GET)
	@RequireHardLogIn
	@Override
	public String back(final RedirectAttributes redirectAttributes)
	{
		return getCheckoutStep().previousStep();
	}

	@RequestMapping(value = "/next", method = RequestMethod.GET)
	@RequireHardLogIn
	@Override
	public String next(final RedirectAttributes redirectAttributes)
	{
		return getCheckoutStep().nextStep();
	}

	@RequestMapping(value = "/getProductVariantMatrix", method = RequestMethod.GET)
	@RequireHardLogIn
	public String getProductVariantMatrix(@RequestParam("productCode") final String productCode, final Model model)
	{
		final ProductData productData = productFacade.getProductForCodeAndOptions(productCode,
				Arrays.asList(ProductOption.BASIC, ProductOption.CATEGORIES, ProductOption.VARIANT_MATRIX_BASE,
						ProductOption.VARIANT_MATRIX_PRICE, ProductOption.VARIANT_MATRIX_MEDIA, ProductOption.VARIANT_MATRIX_STOCK));

		model.addAttribute("product", productData);

		return ControllerConstants.Views.Fragments.Checkout.ReadOnlyExpandedOrderForm;
	}


	@RequestMapping(value = "/getReadOnlyProductVariantMatrix", method = RequestMethod.GET)
	@RequireHardLogIn
	public String getProductVariantMatrixForResponsive(@RequestParam("productCode") final String productCode, final Model model)
	{

		final CartData cartData = getCartFacade().getSessionCart();
		
		final Map<String, ReadOnlyOrderGridData> readOnlyMultiDMap = orderGridFormFacade.getReadOnlyOrderGridForProductInOrder(
				productCode, Arrays.asList(ProductOption.BASIC, ProductOption.CATEGORIES), cartData);
		model.addAttribute("readOnlyMultiDMap", readOnlyMultiDMap);

		return ControllerConstants.Views.Fragments.Checkout.ReadOnlyExpandedOrderForm;
	}


	protected CheckoutStep getCheckoutStep()
	{
		return getCheckoutStep(MULTI);
	}

}
