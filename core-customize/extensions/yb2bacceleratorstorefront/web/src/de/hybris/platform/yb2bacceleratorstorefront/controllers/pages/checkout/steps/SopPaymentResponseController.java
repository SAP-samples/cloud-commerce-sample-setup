/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages.checkout.steps;

import de.hybris.platform.acceleratorfacades.payment.data.PaymentSubscriptionResultData;
import de.hybris.platform.acceleratorservices.payment.data.PaymentErrorField;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.SopPaymentDetailsForm;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.order.data.CCPaymentInfoData;
import de.hybris.platform.commercefacades.user.data.AddressData;
import de.hybris.platform.commerceservices.enums.CountryType;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequestMapping(value = "/checkout/multi/sop")
public class SopPaymentResponseController extends PaymentMethodCheckoutStepController
{
	private static final Logger LOGGER = Logger.getLogger(SopPaymentResponseController.class);

	@RequestMapping(value = "/response", method = RequestMethod.POST)
	@RequireHardLogIn
	public String doHandleSopResponse(final HttpServletRequest request, @Valid final SopPaymentDetailsForm sopPaymentDetailsForm,
			final BindingResult bindingResult, final Model model, final RedirectAttributes redirectAttributes)
			throws CMSItemNotFoundException
	{
		final Map<String, String> resultMap = getRequestParameterMap(request);

		final boolean savePaymentInfo = sopPaymentDetailsForm.isSavePaymentInfo()
				|| getCheckoutCustomerStrategy().isAnonymousCheckout();
		final PaymentSubscriptionResultData paymentSubscriptionResultData = this.getPaymentFacade().completeSopCreateSubscription(
				resultMap, savePaymentInfo, false);

		if (paymentSubscriptionResultData.isSuccess())
		{
			createNewPaymentSubscription(paymentSubscriptionResultData);
		}
		else if (paymentSubscriptionResultData.getDecision() != null && "error".equalsIgnoreCase(paymentSubscriptionResultData.getDecision())
				|| paymentSubscriptionResultData.getErrors() != null && !paymentSubscriptionResultData.getErrors().isEmpty())
		{
			return processErrors(sopPaymentDetailsForm, bindingResult, model,
					redirectAttributes, paymentSubscriptionResultData);
		}
		else
		{
			// SOP ERROR!
			LOGGER.error("Failed to create subscription.  Please check the log files for more information");
			return REDIRECT_URL_ERROR + "/?decision=" + paymentSubscriptionResultData.getDecision() + "&reasonCode="
					+ paymentSubscriptionResultData.getResultCode();
		}

		return getCheckoutStep().nextStep();
	}

	protected String processErrors(@Valid final SopPaymentDetailsForm sopPaymentDetailsForm,
								 final BindingResult bindingResult, final Model model,
								 final RedirectAttributes redirectAttributes,
								 final PaymentSubscriptionResultData paymentSubscriptionResultData)
			throws CMSItemNotFoundException {
		// Have SOP errors that we can display

		setupAddPaymentPage(model);

		// Build up the SOP form data and render page containing form
		try
        {
            setupSilentOrderPostPage(sopPaymentDetailsForm, model);
        }
        catch (final Exception e)
        {
			LOGGER.error("Failed to build beginCreateSubscription request", e);
            GlobalMessages.addErrorMessage(model, "checkout.multi.paymentMethod.addPaymentDetails.generalError");
            return enterStep(model, redirectAttributes);
        }

		processPaymentSubscriptionErrors(bindingResult, model, paymentSubscriptionResultData);

		return ControllerConstants.Views.Pages.MultiStepCheckout.SilentOrderPostPage;
	}

	protected void createNewPaymentSubscription(final PaymentSubscriptionResultData paymentSubscriptionResultData) {
		if (paymentSubscriptionResultData.getStoredCard() != null
				&& StringUtils.isNotBlank(paymentSubscriptionResultData.getStoredCard().getSubscriptionId())) {
			final CCPaymentInfoData newPaymentSubscription = paymentSubscriptionResultData.getStoredCard();

			if (getUserFacade().getCCPaymentInfos(true).size() <= 1) {
				getUserFacade().setDefaultPaymentInfo(newPaymentSubscription);
			}
			getCheckoutFacade().setPaymentDetails(newPaymentSubscription.getId());
		}
	}

	protected void processPaymentSubscriptionErrors(final BindingResult bindingResult, final Model model,
												  final PaymentSubscriptionResultData paymentSubscriptionResultData) {
		if (paymentSubscriptionResultData.getErrors() != null && !paymentSubscriptionResultData.getErrors().isEmpty())
        {
            GlobalMessages.addErrorMessage(model, "checkout.error.paymentethod.formentry.invalid");
            // Add in specific errors for invalid fields
            for (final PaymentErrorField paymentErrorField : paymentSubscriptionResultData.getErrors().values())
            {
                if (paymentErrorField.isMissing())
                {
                    bindingResult.rejectValue(paymentErrorField.getName(), "checkout.error.paymentethod.formentry.sop.missing."
                            + paymentErrorField.getName(), "Please enter a value for this field");
                }
                if (paymentErrorField.isInvalid())
                {
                    bindingResult.rejectValue(paymentErrorField.getName(), "checkout.error.paymentethod.formentry.sop.invalid."
                            + paymentErrorField.getName(), "This value is invalid for this field");
                }
            }
        }
        else if (paymentSubscriptionResultData.getDecision() != null
					&& "error".equalsIgnoreCase(paymentSubscriptionResultData.getDecision()))
        {
			LOGGER.error("Failed to create subscription. Error occurred while contacting external payment services.");
            GlobalMessages.addErrorMessage(model, "checkout.multi.paymentMethod.addPaymentDetails.generalError");
        }
	}

	@RequestMapping(value = "/billingaddressform", method = RequestMethod.GET)
	public String getCountryAddressForm(@RequestParam("countryIsoCode") final String countryIsoCode,
			@RequestParam("useDeliveryAddress") final boolean useDeliveryAddress, final Model model)
	{
		model.addAttribute("supportedCountries", getCheckoutFacade().getCountries(CountryType.BILLING));
		model.addAttribute("regions", getI18NFacade().getRegionsForCountryIso(countryIsoCode));
		model.addAttribute("country", countryIsoCode);

		final SopPaymentDetailsForm sopPaymentDetailsForm = new SopPaymentDetailsForm();
		model.addAttribute("sopPaymentDetailsForm", sopPaymentDetailsForm);
		if (useDeliveryAddress)
		{
			final AddressData deliveryAddress = getCheckoutFacade().getCheckoutCart().getDeliveryAddress();

			if (deliveryAddress.getRegion() != null && !StringUtils.isEmpty(deliveryAddress.getRegion().getIsocode()))
			{
				sopPaymentDetailsForm.setBillTo_state(deliveryAddress.getRegion().getIsocodeShort());
			}

			sopPaymentDetailsForm.setBillTo_titleCode(deliveryAddress.getTitleCode());
			sopPaymentDetailsForm.setBillTo_firstName(deliveryAddress.getFirstName());
			sopPaymentDetailsForm.setBillTo_lastName(deliveryAddress.getLastName());
			sopPaymentDetailsForm.setBillTo_street1(deliveryAddress.getLine1());
			sopPaymentDetailsForm.setBillTo_street2(deliveryAddress.getLine2());
			sopPaymentDetailsForm.setBillTo_city(deliveryAddress.getTown());
			sopPaymentDetailsForm.setBillTo_postalCode(deliveryAddress.getPostalCode());
			sopPaymentDetailsForm.setBillTo_country(deliveryAddress.getCountry().getIsocode());
			sopPaymentDetailsForm.setBillTo_phoneNumber(deliveryAddress.getPhone());
		}
		return ControllerConstants.Views.Fragments.Checkout.BillingAddressForm;
	}


}
