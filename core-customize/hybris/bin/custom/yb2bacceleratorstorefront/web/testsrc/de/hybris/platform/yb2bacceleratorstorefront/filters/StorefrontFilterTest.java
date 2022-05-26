/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.history.BrowseHistory;
import de.hybris.platform.commercefacades.storesession.StoreSessionFacade;
import de.hybris.platform.commercefacades.storesession.data.LanguageData;
import de.hybris.platform.commerceservices.i18n.CommerceCommonI18NService;
import de.hybris.platform.core.model.c2l.LanguageModel;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpMethod;
import org.springframework.util.PathMatcher;
import org.springframework.web.util.CookieGenerator;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class StorefrontFilterTest
{
	private static final String REQUESTEDURL = "http://requestedurl.hybris.de";
	private static final String SERVLET_PATH = "/cart/export";
	private static final String EXCLUDEDURL_PATTERN = "/**/cart/export";

	private StorefrontFilter filter;

	@Mock
	private BrowseHistory browseHistory;

	@Mock
	private CookieGenerator cookieGenerator;

	@Mock
	private HttpServletRequest request;

	@Mock
	private HttpServletResponse response;

	@Mock
	private HttpSession session;

	@Mock
	private FilterChain filterChain;

	@Mock
	private StoreSessionFacade storeSessionFacade;

	@Mock
	private Enumeration<Locale> locales;

	@Mock
	private PathMatcher pathMatcher;

	@Mock
	private CommerceCommonI18NService commerceCommonI18NService;
	@Mock
	private LanguageModel languageModel;


	@Before
	public void initFilter()
	{
		filter = new StorefrontFilter();
		filter.setBrowseHistory(browseHistory);
		filter.setStoreSessionFacade(storeSessionFacade);
		filter.setPathMatcher(pathMatcher);

		final Set<String> excludedUrlSet = new HashSet<String>();
		excludedUrlSet.add(EXCLUDEDURL_PATTERN);
		filter.setRefererExcludeUrlSet(excludedUrlSet);

		Mockito.when(request.getSession()).thenReturn(session);
		Mockito.when(request.getLocales()).thenReturn(locales);
		final StringBuffer requestUrlSb = new StringBuffer();
		requestUrlSb.append(REQUESTEDURL);
		Mockito.when(request.getRequestURL()).thenReturn(requestUrlSb);
		Mockito.when(request.getRequestURI()).thenReturn(requestUrlSb.toString());
		Mockito.when(request.getServletPath()).thenReturn(SERVLET_PATH);
		Mockito.when(pathMatcher.match(EXCLUDEDURL_PATTERN, SERVLET_PATH)).thenReturn(true);

		filter.setCommerceCommonI18NService(commerceCommonI18NService);
		Mockito.when(languageModel.getIsocode()).thenReturn("de");
		Mockito.when(commerceCommonI18NService.getCurrentLanguage()).thenReturn(languageModel);
	}

	@Test
	public void shouldStoreOriginalRefererOnGET() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());
		Mockito.when(request.getHeader(StorefrontFilter.AJAX_REQUEST_HEADER_NAME)).thenReturn(null);
		Mockito.when(filter.isRequestPathExcluded(request)).thenReturn(false);
		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(session).setAttribute(StorefrontFilter.ORIGINAL_REFERER, REQUESTEDURL);
	}

	@Test
	public void shouldNotStoreOriginalRefererOnPOST() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.POST.toString());
		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(session, Mockito.never()).setAttribute(StorefrontFilter.ORIGINAL_REFERER, REQUESTEDURL);
	}

	@Test
	public void shouldNotStoreOriginalRefererOnAjax() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());
		Mockito.when(request.getHeader(StorefrontFilter.AJAX_REQUEST_HEADER_NAME)).thenReturn("1");
		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(session, Mockito.never()).setAttribute(StorefrontFilter.ORIGINAL_REFERER, REQUESTEDURL);
	}


	@Test
	public void shouldNotStoreOriginalRefererOnExcludedUrls() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());
		Mockito.when(request.getHeader(StorefrontFilter.AJAX_REQUEST_HEADER_NAME)).thenReturn(null);
		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(session, Mockito.never()).setAttribute(StorefrontFilter.ORIGINAL_REFERER, REQUESTEDURL);
	}

	@Test
	public void shouldSetCurrentLanguageWhenI18NSetAndLanguageIsInStoreLanguages() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());

		ArrayList<LanguageData> storeLanguages = new ArrayList<LanguageData>();
		LanguageData languageData1 = new LanguageData();
		languageData1.setIsocode("en");
		LanguageData languageData2 = new LanguageData();
		languageData2.setIsocode("de");
		storeLanguages.add(languageData1);
		storeLanguages.add(languageData2);
		Mockito.when(storeSessionFacade.getAllLanguages()).thenReturn(storeLanguages);

		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(commerceCommonI18NService).getCurrentLanguage();
		Mockito.verify(storeSessionFacade, Mockito.times(1)).setCurrentLanguage("de");
	}

	@Test
	public void shouldNotSetCurrentLanguageWhenI18NSetAndLanguageIsNotInStoreLanguages() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());

		ArrayList<LanguageData> storeLanguages = new ArrayList<LanguageData>();
		LanguageData languageData1 = new LanguageData();
		languageData1.setIsocode("en");
		storeLanguages.add(languageData1);
		Mockito.when(storeSessionFacade.getAllLanguages()).thenReturn(storeLanguages);

		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(commerceCommonI18NService).getCurrentLanguage();
		Mockito.verify(storeSessionFacade, Mockito.never()).setCurrentLanguage(Mockito.anyString());
	}

	@Test
	public void shouldNotSetCurrentLanguageWhenI18NNotSet() throws IOException, ServletException
	{
		Mockito.when(request.getMethod()).thenReturn(HttpMethod.GET.toString());
		Mockito.when(languageModel.getIsocode()).thenReturn("");
		filter.doFilterInternal(request, response, filterChain);
		Mockito.verify(commerceCommonI18NService).getCurrentLanguage();
		Mockito.verify(storeSessionFacade, Mockito.never()).setCurrentLanguage(Mockito.anyString());
	}
}
