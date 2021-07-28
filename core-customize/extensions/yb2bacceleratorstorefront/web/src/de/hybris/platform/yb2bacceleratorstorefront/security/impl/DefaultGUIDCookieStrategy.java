/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security.impl;

import de.hybris.platform.acceleratorstorefrontcommons.security.GUIDCookieStrategy;
import de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforecontroller.RequireHardLoginBeforeControllerHandler;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Hex;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.util.Assert;
import org.springframework.web.util.CookieGenerator;


/**
 * Default implementation of {@link GUIDCookieStrategy}
 */
public class DefaultGUIDCookieStrategy implements GUIDCookieStrategy
{
	private static final Logger LOG = Logger.getLogger(DefaultGUIDCookieStrategy.class);
	private static final int RANDOM_BYTES = 20;

	private final SecureRandom random;

	private CookieGenerator cookieGenerator;

	public DefaultGUIDCookieStrategy() throws NoSuchAlgorithmException
	{
		random = SecureRandom.getInstance("SHA1PRNG");
		Assert.notNull(random);
	}

	@Override
	public void setCookie(final HttpServletRequest request, final HttpServletResponse response)
	{
		if (!request.isSecure())
		{
			// We must not generate the cookie for insecure requests, otherwise there is not point doing this at all
			throw new IllegalStateException("Cannot set GUIDCookie on an insecure request!");
		}

		final String guid = createGUID();

		getCookieGenerator().addCookie(response, guid);
		request.getSession().setAttribute(RequireHardLoginBeforeControllerHandler.SECURE_GUID_SESSION_KEY, guid);

		if (LOG.isInfoEnabled())
		{
			LOG.info("Setting guid cookie and session attribute: " + guid);
		}
	}

	@Override
	public void deleteCookie(final HttpServletRequest request, final HttpServletResponse response)
	{
		if (!request.isSecure())
		{
			LOG.error("Cannot remove secure GUIDCookie during an insecure request. I should have been called from a secure page.");
		}
		else
		{
			// Its a secure page, we can delete the cookie
			getCookieGenerator().removeCookie(response);
		}
	}

	protected String createGUID()
	{
		final byte[] randomBytes = new byte[RANDOM_BYTES];
		getRandom().nextBytes(randomBytes);
		return String.valueOf(Hex.encodeHex(randomBytes));
	}

	protected CookieGenerator getCookieGenerator()
	{
		return cookieGenerator;
	}

	/**
	 * @param cookieGenerator
	 *           the cookieGenerator to set
	 */
	@Required
	public void setCookieGenerator(final CookieGenerator cookieGenerator)
	{
		this.cookieGenerator = cookieGenerator;
	}


	protected SecureRandom getRandom()
	{
		return random;
	}
}
