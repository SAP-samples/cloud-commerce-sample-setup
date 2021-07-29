/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.servicelayer.session.SessionService;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.ModelAndView;


/**
 * Handler to add cart restoration messages when appropriate
 *
 */
public class CartRestorationBeforeViewHandler implements BeforeViewHandler
{
	private SessionService sessionService;
	private List<String> pagesToShowModifications;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
			throws Exception
	{

		if (getSessionService().getAttribute(WebConstants.CART_RESTORATION) != null
				&& getSessionService().getAttribute(WebConstants.CART_RESTORATION_SHOW_MESSAGE) != null
				&& ((Boolean) getSessionService().getAttribute(WebConstants.CART_RESTORATION_SHOW_MESSAGE)).booleanValue())
		{

			if (getSessionService().getAttribute(WebConstants.CART_RESTORATION_ERROR_STATUS) != null)
			{
				modelAndView.getModel().put("restorationErrorMsg",
						getSessionService().getAttribute(WebConstants.CART_RESTORATION_ERROR_STATUS));
			}
			else
			{
				modelAndView.getModel().put("restorationData", getSessionService().getAttribute(WebConstants.CART_RESTORATION));
			}

			modelAndView.getModel().put("showModifications", showModifications(request));
		}

		getSessionService().setAttribute(WebConstants.CART_RESTORATION_SHOW_MESSAGE, Boolean.FALSE);
	}

	/**
	 * Decide whether or not the modifications related to the cart restoration or merge should be displayed in the
	 * notifications
	 *
	 * @param request
	 * @return whether or not to display the modifications
	 */
	protected Boolean showModifications(final HttpServletRequest request)
	{
		for (final String targetPage : getPagesToShowModifications())
		{
			if (StringUtils.contains(request.getRequestURI().toString(), targetPage))
			{
				return Boolean.TRUE;
			}
		}
		return Boolean.FALSE;
	}

	protected SessionService getSessionService()
	{
		return sessionService;
	}

	@Required
	public void setSessionService(final SessionService sessionService)
	{
		this.sessionService = sessionService;
	}

	protected List<String> getPagesToShowModifications()
	{
		return pagesToShowModifications;
	}

	@Required
	public void setPagesToShowModifications(final List<String> pagesToShowModifications)
	{
		this.pagesToShowModifications = pagesToShowModifications;
	}

}
