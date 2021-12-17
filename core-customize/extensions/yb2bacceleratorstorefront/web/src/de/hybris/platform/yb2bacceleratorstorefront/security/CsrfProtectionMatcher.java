/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.security;

import de.hybris.platform.util.Config;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;


/**
 * This matcher returns true for POST method and the request's servlet path does not match with the combined list of
 * csrf.allowed.url.patterns from properties file and csrfAllowedUrlPatterns from spring configuration. Otherwise, it
 * will return false.
 */
public class CsrfProtectionMatcher implements RequestMatcher
{
	private static final Logger LOG = LoggerFactory.getLogger(CsrfProtectionMatcher.class);

	// Comma separated URL patterns (regular expression) that should not be protected from CSRF token validation
	private static final String CSRF_PROTECTION_EXCLUDE_URLS = "csrf.allowed.url.patterns";

	// List of URL patterns (regular expression) that should be allowed to go through without CSRF token validation
	private List<String> csrfAllowedUrlPatterns;

	// Set of request method that should be CSRF token validated
	private final HashSet<String> csrfProtectedMethodSet = new HashSet<String>(Arrays.asList("POST"));

	@Override
	public boolean matches(final HttpServletRequest request)
	{
		if (csrfProtectedMethodSet.contains(request.getMethod()))
		{
			final String protectionExcludeUrls = Config.getParameter(CSRF_PROTECTION_EXCLUDE_URLS);
			final Set<String> protectionExcludeUrlSet = StringUtils.commaDelimitedListToSet(protectionExcludeUrls);
			if (CollectionUtils.isNotEmpty(csrfAllowedUrlPatterns))
			{
				// URL patterns from properties files and from spring configuration list will be combined into one set
				protectionExcludeUrlSet.addAll(csrfAllowedUrlPatterns);
			}

			for (final String pattern : protectionExcludeUrlSet)
			{
				if (request.getServletPath() != null && request.getServletPath().matches(pattern))
				{
					// Request URL pattern matches with excludeUrl set
					if (LOG.isDebugEnabled())
					{
						LOG.debug("CSRF protection is excluded for this URL {}", request.getServletPath());
					}
					return false;
				}
			}
			// CSRF protection is required for specified protectionExcludeUrlSet
			return true;
		}
		// CSRF protection is not required other methods
		return false;
	}

	/**
	 * @return the csrfAllowedUrlPatterns
	 */
	protected List<String> getCsrfAllowedUrlPatterns()
	{
		return csrfAllowedUrlPatterns;
	}

	/**
	 * @param csrfAllowedUrlPatterns
	 *           the csrfAllowedUrlPatterns to set
	 */
	public void setCsrfAllowedUrlPatterns(final List<String> csrfAllowedUrlPatterns)
	{
		this.csrfAllowedUrlPatterns = csrfAllowedUrlPatterns;
	}
}
