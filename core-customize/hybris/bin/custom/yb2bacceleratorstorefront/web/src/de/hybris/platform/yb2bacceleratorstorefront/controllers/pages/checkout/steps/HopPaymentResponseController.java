/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages.checkout.steps;


import de.hybris.platform.acceleratorfacades.payment.data.PaymentSubscriptionResultData;
import de.hybris.platform.acceleratorstorefrontcommons.annotations.RequireHardLogIn;
import de.hybris.platform.acceleratorstorefrontcommons.checkout.steps.validation.ValidationResults;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.order.data.CCPaymentInfoData;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequestMapping(value = "/checkout/multi/hop")
public class HopPaymentResponseController extends PaymentMethodCheckoutStepController
{
	private static final Logger LOGGER = Logger.getLogger(HopPaymentResponseController.class);

	@RequestMapping(value = "/response", method = RequestMethod.POST)
	@RequireHardLogIn
	public String doHandleHopResponse(final HttpServletRequest request)
	{
		final Map<String, String> resultMap = getRequestParameterMap(request);

		final PaymentSubscriptionResultData paymentSubscriptionResultData = getPaymentFacade().completeHopCreateSubscription(
				resultMap, true);
		if (paymentSubscriptionResultData.isSuccess() && paymentSubscriptionResultData.getStoredCard() != null
				&& StringUtils.isNotBlank(paymentSubscriptionResultData.getStoredCard().getSubscriptionId()))
		{
			final CCPaymentInfoData newPaymentSubscription = paymentSubscriptionResultData.getStoredCard();

			if (getUserFacade().getCCPaymentInfos(true).size() <= 1)
			{
				getUserFacade().setDefaultPaymentInfo(newPaymentSubscription);
			}
			getCheckoutFacade().setPaymentDetails(newPaymentSubscription.getId());
		}
		else
		{
			// HOP ERROR!
			LOGGER.error("Failed to create subscription.  Please check the log files for more information");
			return REDIRECT_URL_ERROR + "/?decision=" + paymentSubscriptionResultData.getDecision() + "&reasonCode="
					+ paymentSubscriptionResultData.getResultCode();
		}

		return getCheckoutStep().nextStep();
	}

	@RequestMapping(value = "/error", method = RequestMethod.GET)
	public String doHostedOrderPageError(@RequestParam(required = true) final String decision,
			@RequestParam(required = true) final String reasonCode, final Model model, final RedirectAttributes redirectAttributes)
			throws CMSItemNotFoundException
	{
		String redirectUrl = REDIRECT_URL_ADD_PAYMENT_METHOD;
		final ValidationResults validationResults = getCheckoutStep().validate(redirectAttributes);
		if (getCheckoutStep().checkIfValidationErrors(validationResults))
		{
			redirectUrl = getCheckoutStep().onValidation(validationResults);
		}
		model.addAttribute("decision", decision);
		model.addAttribute("reasonCode", reasonCode);
		model.addAttribute("redirectUrl", redirectUrl.replace(REDIRECT_PREFIX, ""));
		model.addAttribute(WebConstants.BREADCRUMBS_KEY,
				getResourceBreadcrumbBuilder().getBreadcrumbs("checkout.multi.hostedOrderPageError.breadcrumb"));
		final ContentPageModel multiCheckoutSummaryPage = getContentPageForLabelOrId(MULTI_CHECKOUT_SUMMARY_CMS_PAGE_LABEL);
		storeCmsPageInModel(model, multiCheckoutSummaryPage);
		setUpMetaDataForContentPage(model, multiCheckoutSummaryPage);
		setCheckoutStepLinksForModel(model, getCheckoutStep());

		GlobalMessages.addErrorMessage(model, "checkout.multi.hostedOrderPageError.globalError");

		return ControllerConstants.Views.Pages.MultiStepCheckout.HostedOrderPageErrorPage;
	}

}
