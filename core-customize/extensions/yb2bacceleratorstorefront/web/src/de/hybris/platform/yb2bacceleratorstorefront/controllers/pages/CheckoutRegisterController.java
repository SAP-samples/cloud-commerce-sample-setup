/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractRegisterPageController;
import de.hybris.platform.acceleratorstorefrontcommons.forms.RegisterForm;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.AbstractPageModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


/**
 * Checkout Register Controller. Handles login and register for the checkout flow.
 */
@Controller
@RequestMapping(value = "/register/checkout")
public class CheckoutRegisterController extends AbstractRegisterPageController
{
	@Override
	protected AbstractPageModel getCmsPage() throws CMSItemNotFoundException
	{
		return getContentPageForLabelOrId("checkout-register");
	}

	@Override
	protected String getSuccessRedirect(final HttpServletRequest request, final HttpServletResponse response)
	{
		// Redirect to the main checkout controller to handle checkout.
		return "/checkout";
	}

	@Override
	protected String getView()
	{
		return ControllerConstants.Views.Pages.Checkout.CheckoutRegisterPage;
	}

	@RequestMapping(method = RequestMethod.GET)
	public String doCheckoutRegister(final Model model, final HttpServletRequest request) throws CMSItemNotFoundException //NOSONAR
	{
		return getDefaultRegistrationPage(model);
	}

	@RequestMapping(value = "/newcustomer", method = RequestMethod.POST)
	public String doCheckoutRegister(final RegisterForm form, final BindingResult bindingResult, final Model model,
			final HttpServletRequest request, final HttpServletResponse response, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException
	{
		getRegistrationValidator().validate(form, bindingResult);
		return processRegisterUserRequest(null, form, bindingResult, model, request, response, redirectModel);
	}
}
