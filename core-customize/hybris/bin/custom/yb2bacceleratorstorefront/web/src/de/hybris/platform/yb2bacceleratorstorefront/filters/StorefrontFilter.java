/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.platform.acceleratorstorefrontcommons.history.BrowseHistory;
import de.hybris.platform.acceleratorstorefrontcommons.history.BrowseHistoryEntry;
import de.hybris.platform.cms2.misc.CMSFilter;
import de.hybris.platform.commercefacades.storesession.StoreSessionFacade;
import de.hybris.platform.commerceservices.i18n.CommerceCommonI18NService;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.util.PathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;


/**
 * Filter that initializes the session for the yb2bacceleratorstorefront. This is a spring configured filter that is
 * executed by the PlatformFilterChain.
 */
public class StorefrontFilter extends OncePerRequestFilter
{
	public static final String AJAX_REQUEST_HEADER_NAME = "X-Requested-With";
	public static final String ORIGINAL_REFERER = "originalReferer";

	private StoreSessionFacade storeSessionFacade;
	private BrowseHistory browseHistory;
	private Set<String> refererExcludeUrlSet;
	private PathMatcher pathMatcher;
	private CommerceCommonI18NService commerceCommonI18NService;

	@Override
	public void doFilterInternal(final HttpServletRequest request, final HttpServletResponse response,
			final FilterChain filterChain) throws IOException, ServletException
	{
		final HttpSession session = request.getSession();
		final String queryString = request.getQueryString();

		if (isSessionNotInitialized(session, queryString))
		{

			initDefaults(request);
			markSessionInitialized(session);
		}

		if (isGetMethod(request))
		{
			if (StringUtils.isBlank(request.getHeader(AJAX_REQUEST_HEADER_NAME)) && !isRequestPathExcluded(request))
			{
				final String requestURL = request.getRequestURL().toString();
				session.setAttribute(ORIGINAL_REFERER, StringUtils.isNotBlank(queryString) ? requestURL + "?" + queryString
						: requestURL);	// NOSONAR
			}

			getBrowseHistory().addBrowseHistoryEntry(new BrowseHistoryEntry(request.getRequestURI(), null));
		}

		filterChain.doFilter(request, response);
	}

	protected boolean isGetMethod(final HttpServletRequest httpRequest)
	{
		return "GET".equalsIgnoreCase(httpRequest.getMethod());
	}

	protected boolean isRequestSecure(final HttpServletRequest httpRequest)
	{
		return httpRequest.isSecure();
	}

	protected boolean isSessionNotInitialized(final HttpSession session, final String queryString)
	{
		return session.isNew() || StringUtils.contains(queryString, CMSFilter.CLEAR_CMSSITE_PARAM)
				|| !isSessionInitialized(session);
	}

	@Required
	public void setStoreSessionFacade(final StoreSessionFacade storeSessionFacade)
	{
		this.storeSessionFacade = storeSessionFacade;
	}

	@Required
	public void setBrowseHistory(final BrowseHistory browseHistory)
	{
		this.browseHistory = browseHistory;
	}

	protected void initDefaults(final HttpServletRequest request)
	{
		final String currentLanguage = commerceCommonI18NService.getCurrentLanguage().getIsocode();
		getStoreSessionFacade().initializeSession(Collections.list(request.getLocales()));
		if (StringUtils.isNotBlank(currentLanguage)){
			getStoreSessionFacade().setCurrentLanguage(currentLanguage);
		}
	}

	protected StoreSessionFacade getStoreSessionFacade()
	{
		return storeSessionFacade;
	}

	protected BrowseHistory getBrowseHistory()
	{
		return browseHistory;
	}


	protected boolean isSessionInitialized(final HttpSession session)
	{
		return session.getAttribute(this.getClass().getName()) != null;
	}

	protected void markSessionInitialized(final HttpSession session)
	{
		session.setAttribute(this.getClass().getName(), "initialized");
	}

	protected boolean isRequestPathExcluded(final HttpServletRequest request)
	{
		final Set<String> inputSet = getRefererExcludeUrlSet();
		final String servletPath = request.getServletPath();

		for (final String input : inputSet)
		{
			if (getPathMatcher().match(input, servletPath))
			{
				return true;
			}
		}

		return false;
	}

	protected Set<String> getRefererExcludeUrlSet()
	{
		return refererExcludeUrlSet;
	}

	@Required
	public void setRefererExcludeUrlSet(final Set<String> refererExcludeUrlSet)
	{
		this.refererExcludeUrlSet = refererExcludeUrlSet;
	}

	protected PathMatcher getPathMatcher()
	{
		return pathMatcher;
	}

	@Required
	public void setPathMatcher(final PathMatcher pathMatcher)
	{
		this.pathMatcher = pathMatcher;
	}

	public void setCommerceCommonI18NService(final CommerceCommonI18NService commerceCommonI18NService)
	{
		this.commerceCommonI18NService = commerceCommonI18NService;
	}
}
