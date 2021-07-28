/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security;

import de.hybris.platform.acceleratorstorefrontcommons.security.BruteForceAttackCounter;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Required;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;


public class LoginAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler
{
	private BruteForceAttackCounter bruteForceAttackCounter;

	@Override
	public void onAuthenticationFailure(final HttpServletRequest request, final HttpServletResponse response,
			final AuthenticationException exception) throws IOException, ServletException
	{
		// Register brute attacks
		bruteForceAttackCounter.registerLoginFailure(request.getParameter("j_username"));

		// Store the j_username in the session
		request.getSession().setAttribute("SPRING_SECURITY_LAST_USERNAME", request.getParameter("j_username"));

		super.onAuthenticationFailure(request, response, exception);
	}



	protected BruteForceAttackCounter getBruteForceAttackCounter()
	{
		return bruteForceAttackCounter;
	}

	@Required
	public void setBruteForceAttackCounter(final BruteForceAttackCounter bruteForceAttackCounter)
	{
		this.bruteForceAttackCounter = bruteForceAttackCounter;
	}
}
