/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.checkout.steps.validation.impl;

import de.hybris.platform.acceleratorstorefrontcommons.checkout.steps.validation.AbstractCheckoutStepValidator;
import de.hybris.platform.acceleratorstorefrontcommons.checkout.steps.validation.ValidationResults;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;



public class DefaultDeliveryMethodCheckoutStepValidator extends AbstractCheckoutStepValidator
{
	private static final Logger LOGGER = Logger.getLogger(DefaultDeliveryMethodCheckoutStepValidator.class);
	@Override
	public ValidationResults validateOnEnter(final RedirectAttributes redirectAttributes)
	{
		if (!getCheckoutFlowFacade().hasValidCart())
		{
			LOGGER.info("Missing, empty or unsupported cart");
			return ValidationResults.REDIRECT_TO_CART;
		}

		if (!getCheckoutFacade().hasShippingItems())
		{
			return ValidationResults.REDIRECT_TO_PICKUP_LOCATION;
		}

		if (getCheckoutFlowFacade().hasNoDeliveryAddress())
		{
			GlobalMessages.addFlashMessage(redirectAttributes, GlobalMessages.ERROR_MESSAGES_HOLDER,
					"checkout.multi.deliveryAddress.notprovided");
			return ValidationResults.REDIRECT_TO_DELIVERY_ADDRESS;
		}

		return ValidationResults.SUCCESS;
	}

	@Override
	public ValidationResults validateOnExit()
	{
		if (getCheckoutFacade().hasPickUpItems())
		{
			return ValidationResults.REDIRECT_TO_PICKUP_LOCATION;
		}
		return ValidationResults.SUCCESS;
	}

}
