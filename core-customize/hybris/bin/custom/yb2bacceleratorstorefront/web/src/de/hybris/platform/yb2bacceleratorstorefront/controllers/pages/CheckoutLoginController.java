/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.flow.CheckoutFlowFacade;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractLoginPageController;
import de.hybris.platform.acceleratorstorefrontcommons.forms.GuestForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.RegisterForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.GuestValidator;
import de.hybris.platform.acceleratorstorefrontcommons.security.GUIDCookieStrategy;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.AbstractPageModel;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


/**
 * Checkout Login Controller. Handles login and register for the checkout flow.
 */
@Controller
@RequestMapping(value = "/login/checkout")
public class CheckoutLoginController extends AbstractLoginPageController
{
	@Resource(name = "checkoutFlowFacade")
	private CheckoutFlowFacade checkoutFlowFacade;

	@Resource(name = "guidCookieStrategy")
	private GUIDCookieStrategy guidCookieStrategy;

	@Resource(name = "authenticationManager")
	private AuthenticationManager authenticationManager;

	@Resource(name = "guestValidator")
	private GuestValidator guestValidator;

	@Override
	protected AbstractPageModel getCmsPage() throws CMSItemNotFoundException
	{
		return getContentPageForLabelOrId("checkout-login");
	}

	@RequestMapping(method = RequestMethod.GET)
	public String doCheckoutLogin(@RequestParam(value = "error", defaultValue = "false") final boolean loginError,
			final HttpSession session, final Model model, final HttpServletRequest request) throws CMSItemNotFoundException //NOSONAR
	{
		model.addAttribute("expressCheckoutAllowed", Boolean.valueOf(checkoutFlowFacade.isExpressCheckoutEnabledForStore()));
		return getDefaultLoginPage(loginError, session, model);
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public String doCheckoutRegister(final RegisterForm form, final BindingResult bindingResult, final Model model,
			final HttpServletRequest request, final HttpServletResponse response, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException
	{
		getRegistrationValidator().validate(form, bindingResult);
		return processRegisterUserRequest(null, form, bindingResult, model, request, response, redirectModel);
	}

	@RequestMapping(value = "/guest", method = RequestMethod.POST)
	public String doAnonymousCheckout(final GuestForm form, final BindingResult bindingResult, final Model model,
			final HttpServletRequest request, final HttpServletResponse response) throws CMSItemNotFoundException
	{
		getGuestValidator().validate(form, bindingResult);
		return processAnonymousCheckoutUserRequest(form, bindingResult, model, request, response);
	}


	@RequestMapping(value = "/register", method = RequestMethod.GET)
	public String checkoutRegister(@RequestParam(value = "error", defaultValue = "false") final boolean loginError,
			final HttpSession session, final Model model, final HttpServletRequest request) throws CMSItemNotFoundException
	{
		return doCheckoutLogin(loginError, session, model, request);
	}

	@RequestMapping(value = "/guest", method = RequestMethod.GET)
	public String doAnonymousCheckout(@RequestParam(value = "error", defaultValue = "false") final boolean loginError,
			final HttpSession session, final Model model, final HttpServletRequest request) throws CMSItemNotFoundException
	{
		return doCheckoutLogin(loginError, session, model, request);
	}

	@Override
	protected String getView()
	{
		return ControllerConstants.Views.Pages.Checkout.CheckoutLoginPage;
	}

	@Override
	protected String getSuccessRedirect(final HttpServletRequest request, final HttpServletResponse response)
	{
		if (hasItemsInCart())
		{
			return getCheckoutUrl();
		}
		// Redirect to the main checkout controller to handle checkout.
		return "/checkout";
	}

	/**
	 * Checks if there are any items in the cart.
	 *
	 * @return returns true if items found in cart.
	 */
	protected boolean hasItemsInCart()
	{
		final CartData cartData = getCheckoutFlowFacade().getCheckoutCart();

		return cartData.getEntries() != null && !cartData.getEntries().isEmpty();
	}

	protected String getCheckoutUrl()
	{
		// Default to the multi-step checkout
		return "/checkout/multi";
	}

	protected GuestValidator getGuestValidator()
	{
		return guestValidator;
	}

	protected CheckoutFlowFacade getCheckoutFlowFacade()
	{
		return checkoutFlowFacade;
	}

	@Override
	protected GUIDCookieStrategy getGuidCookieStrategy()
	{
		return guidCookieStrategy;
	}

	protected AuthenticationManager getAuthenticationManager()
	{
		return authenticationManager;
	}
}
