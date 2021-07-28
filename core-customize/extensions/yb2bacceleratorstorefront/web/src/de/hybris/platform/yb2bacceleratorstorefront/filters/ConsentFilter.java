/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.commercefacades.consent.AnonymousConsentFacade;
import de.hybris.platform.commercefacades.consent.data.AnonymousConsentData;
import de.hybris.platform.commercefacades.user.UserFacade;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Consumer;
import java.util.function.Supplier;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import static java.nio.charset.StandardCharsets.UTF_8;


/**
 * Filter which handle consent for anonymous customers.<br/>
 * It read consent cookie and based on it set proper consent in session.
 */
public class ConsentFilter extends OncePerRequestFilter
{
	private static final Logger LOG = LoggerFactory.getLogger(ConsentFilter.class);

	private static final ObjectMapper mapper = new ObjectMapper();
	private static final int NEVER_EXPIRES = (int) TimeUnit.DAYS.toSeconds(365); // 365 days for expiring

	private UserFacade userFacade;
	private AnonymousConsentFacade anonymousConsentFacade;

	@Override
	protected void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws ServletException, IOException
	{
		handleConsents(request, response);
		filterChain.doFilter(request, response);
	}

	void handleConsents(final HttpServletRequest request, final HttpServletResponse response)
	{
		if (!getUserFacade().isAnonymousUser())
		{
			LOG.debug("user is not anonymous, nothing to filter");
			return;
		}

		final Supplier<List<AnonymousConsentData>> consentReader = () -> readConsentCookies(request);
		final Consumer<List<AnonymousConsentData>> consentWriter = consents -> writeConsentCookies(response, consents);

		getAnonymousConsentFacade().synchronizeAnonymousConsents(consentReader, consentWriter);
	}

	protected List<AnonymousConsentData> readConsentCookies(final HttpServletRequest request)
	{
		final Cookie cookie = WebUtils.getCookie(request, WebConstants.ANONYMOUS_CONSENT_COOKIE);

		if (cookie != null)
		{
			try
			{
				final String cookieValue = URLDecoder.decode(cookie.getValue(), UTF_8);
				return Arrays.asList(mapper.readValue(cookieValue, AnonymousConsentData[].class));
			}
			catch (final IOException e)
			{
				LOG.error("IOException occurred while reading the cookie", e);
			}
		}

		return Collections.emptyList();
	}

	protected void writeConsentCookies(final HttpServletResponse response, final List<AnonymousConsentData> consents)
	{
		try
		{
			final String cookieValue = mapper.writeValueAsString(consents);
			final Cookie cookie = new Cookie(WebConstants.ANONYMOUS_CONSENT_COOKIE, URLEncoder.encode(cookieValue, UTF_8));

			cookie.setMaxAge(NEVER_EXPIRES);
			cookie.setPath("/");
			cookie.setHttpOnly(true);
			cookie.setSecure(true);

			response.addCookie(cookie);
		}
		catch (final IOException e)
		{
			LOG.error("IOException occurred while writing the cookie to the Servlet Response", e);
		}
	}

	protected UserFacade getUserFacade()
	{
		return userFacade;
	}

	@Required
	public void setUserFacade(final UserFacade userFacade)
	{
		this.userFacade = userFacade;
	}

	protected AnonymousConsentFacade getAnonymousConsentFacade()
	{
		return anonymousConsentFacade;
	}

	@Required
	public void setAnonymousConsentFacade(final AnonymousConsentFacade anonymousConsentFacade)
	{
		this.anonymousConsentFacade = anonymousConsentFacade;
	}
}
