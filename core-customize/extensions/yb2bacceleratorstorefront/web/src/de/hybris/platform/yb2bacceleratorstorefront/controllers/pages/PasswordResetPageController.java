/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.ForgottenPwdForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdatePwdForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.UpdatePasswordFormValidator;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.pages.ContentPageModel;
import de.hybris.platform.commercefacades.customer.CustomerFacade;
import de.hybris.platform.commerceservices.customer.TokenInvalidatedException;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
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


/**
 * Controller for the forgotten password pages. Supports requesting a password reset email as well as changing the
 * password once you have got the token that was sent via email.
 */
@Controller
@RequestMapping(value = "/login/pw")
public class PasswordResetPageController extends AbstractPageController
{
	private static final String FORGOTTEN_PWD_TITLE = "forgottenPwd.title";

	@SuppressWarnings("unused")
	private static final Logger LOG = Logger.getLogger(PasswordResetPageController.class);

	private static final String REDIRECT_PWD_REQ_CONF = "redirect:/login/pw/request/external/conf";
	private static final String REDIRECT_LOGIN = "redirect:/login";
	private static final String REDIRECT_HOME = "redirect:/";
	private static final String UPDATE_PWD_CMS_PAGE = "updatePassword";

	@Resource(name = "customerFacade")
	private CustomerFacade customerFacade;

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "updatePasswordFormValidator")
	private UpdatePasswordFormValidator updatePasswordFormValidator;


	@RequestMapping(value = "/request", method = RequestMethod.GET)
	public String getPasswordRequest(final Model model) throws CMSItemNotFoundException
	{
		model.addAttribute(new ForgottenPwdForm());
		return ControllerConstants.Views.Fragments.Password.PasswordResetRequestPopup;
	}

	@RequestMapping(value = "/request", method = RequestMethod.POST)
	public String passwordRequest(@Valid final ForgottenPwdForm form, final BindingResult bindingResult, final Model model)
			throws CMSItemNotFoundException
	{
		if (bindingResult.hasErrors())
		{
			return ControllerConstants.Views.Fragments.Password.PasswordResetRequestPopup;
		}
		else
		{
			try
			{
				customerFacade.forgottenPassword(form.getEmail());
			}
			catch (final UnknownIdentifierException unknownIdentifierException)
			{
				LOG.warn("Email: " + form.getEmail() + " does not exist in the database.");
			}
			return ControllerConstants.Views.Fragments.Password.ForgotPasswordValidationMessage;
		}
	}

	@RequestMapping(value = "/request/external", method = RequestMethod.GET)
	public String getExternalPasswordRequest(final Model model) throws CMSItemNotFoundException
	{
		model.addAttribute(new ForgottenPwdForm());
		final ContentPageModel contentPage = getContentPageForLabelOrId(null);
		storeCmsPageInModel(model, contentPage);
		setUpMetaDataForContentPage(model, contentPage);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs(FORGOTTEN_PWD_TITLE));
		return ControllerConstants.Views.Pages.Password.PasswordResetRequest;
	}

	@RequestMapping(value = "/request/external/conf", method = RequestMethod.GET)
	public String getExternalPasswordRequestConf(final Model model) throws CMSItemNotFoundException
	{
		final ContentPageModel contentPage = getContentPageForLabelOrId(null);
		storeCmsPageInModel(model, contentPage);
		setUpMetaDataForContentPage(model, contentPage);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs(FORGOTTEN_PWD_TITLE));
		return ControllerConstants.Views.Pages.Password.PasswordResetRequestConfirmation;
	}

	@RequestMapping(value = "/request/external", method = RequestMethod.POST)
	public String externalPasswordRequest(@Valid final ForgottenPwdForm form, final BindingResult bindingResult, final Model model, final RedirectAttributes redirectModel)
			throws CMSItemNotFoundException
	{
		final ContentPageModel contentPage = getContentPageForLabelOrId(null);
		storeCmsPageInModel(model, contentPage);
		setUpMetaDataForContentPage(model, contentPage);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs(FORGOTTEN_PWD_TITLE));

		if (bindingResult.hasErrors())
		{
			return ControllerConstants.Views.Pages.Password.PasswordResetRequest;
		}
		else
		{
			try
			{
				customerFacade.forgottenPassword(form.getEmail());
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
										"account.confirmation.forgotten.password.link.sent");
			}
			catch (final UnknownIdentifierException unknownIdentifierException)
			{
				LOG.warn("Email: " + form.getEmail() + " does not exist in the database.");
			}
			return REDIRECT_PWD_REQ_CONF;
		}
	}

	@RequestMapping(value = "/change", method = RequestMethod.GET)
	public String getChangePassword(@RequestParam(required = false) final String token, final Model model)
			throws CMSItemNotFoundException
	{
		if (StringUtils.isBlank(token))
		{
			return REDIRECT_HOME;
		}
		final UpdatePwdForm form = new UpdatePwdForm();
		form.setToken(token);
		model.addAttribute(form);
		final ContentPageModel updatePwdPage = getContentPageForLabelOrId(UPDATE_PWD_CMS_PAGE);
		storeCmsPageInModel(model, updatePwdPage);
		setUpMetaDataForContentPage(model, updatePwdPage);
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs("updatePwd.title"));
		return ControllerConstants.Views.Pages.Password.PasswordResetChangePage;
	}

	@RequestMapping(value = "/change", method = RequestMethod.POST)
	public String changePassword(@Valid final UpdatePwdForm form, final BindingResult bindingResult, final Model model,
			final RedirectAttributes redirectModel) throws CMSItemNotFoundException
	{
		getUpdatePasswordFormValidator().validate(form, bindingResult);
		if (bindingResult.hasErrors())
		{
			prepareErrorMessage(model, UPDATE_PWD_CMS_PAGE);
			return ControllerConstants.Views.Pages.Password.PasswordResetChangePage;
		}
		if (!StringUtils.isBlank(form.getToken()))
		{
			try
			{
				customerFacade.updatePassword(form.getToken(), form.getPwd());
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
						"account.confirmation.password.updated");
			}
			catch (final TokenInvalidatedException e)
			{
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "updatePwd.token.invalidated");
			}
			catch (final RuntimeException e)
			{
				if (LOG.isDebugEnabled())
				{
					LOG.debug(e);
				}
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER, "updatePwd.token.invalid");
			}
		}
		return REDIRECT_LOGIN;
	}

	/**
	 * Prepares the view to display an error message
	 *
	 * @throws CMSItemNotFoundException
	 */
	protected void prepareErrorMessage(final Model model, final String page) throws CMSItemNotFoundException
	{
		GlobalMessages.addErrorMessage(model, "form.global.error");
		final ContentPageModel contentPage = getContentPageForLabelOrId(page);
		storeCmsPageInModel(model, contentPage);
		setUpMetaDataForContentPage(model, contentPage);
	}


	public UpdatePasswordFormValidator getUpdatePasswordFormValidator()
	{
		return updatePasswordFormValidator;
	}
}
