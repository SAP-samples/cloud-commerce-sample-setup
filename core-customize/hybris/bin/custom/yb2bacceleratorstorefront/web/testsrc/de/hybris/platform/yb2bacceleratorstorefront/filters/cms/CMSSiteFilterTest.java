/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters.cms;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorcms.context.ContextInformationLoader;
import de.hybris.platform.acceleratorcms.data.CmsPageRequestContextData;
import de.hybris.platform.acceleratorcms.services.CMSPageContextService;
import de.hybris.platform.acceleratorservices.site.strategies.SiteChannelValidationStrategy;
import de.hybris.platform.cms2.model.preview.CMSPreviewTicketModel;
import de.hybris.platform.cms2.model.preview.PreviewDataModel;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSPreviewService;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.commerceservices.i18n.CommerceCommonI18NService;
import de.hybris.platform.commerceservices.url.UrlResolver;
import de.hybris.platform.core.model.c2l.LanguageModel;
import de.hybris.platform.servicelayer.session.SessionService;
import de.hybris.platform.site.BaseSiteService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Collections;

import static de.hybris.platform.cms2.misc.CMSFilter.PREVIEW_TICKET_ID_PARAM;
import static de.hybris.platform.cms2.misc.CMSFilter.PREVIEW_TOKEN;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CMSSiteFilterTest
{
	private static final String NORMAL_REQUEST_URL = "https://normalRequestUrl/";
	private static final String PREVIEW_REQUEST_URL = "https://previewRequestUrl/" + PREVIEW_TOKEN;
	private static final String PREVIEW_SITE_URL = "https://siteUrl/?site=abc";
	private static final String TICKET_ID = "1234";

	@InjectMocks
	private CMSSiteFilter cmsSiteFilter;

	@Mock
	private CMSSiteService cmsSiteService;
	@Mock
	private SessionService sessionService;
	@Mock
	private CMSPreviewService cmsPreviewService;
	@Mock
	private CommerceCommonI18NService commerceCommonI18NService;
	@Mock
	private BaseSiteService baseSiteService;
	@Mock
	private UrlResolver<PreviewDataModel> previewDataModelUrlResolver;
	@Mock
	private ContextInformationLoader contextInformationLoader;
	@Mock
	private CMSPageContextService cmsPageContextService;
	@Mock
	private SiteChannelValidationStrategy siteChannelValidationStrategy;

	@Mock
	private HttpServletRequest httpRequest;
	@Mock
	private HttpServletResponse httpResponse;
	@Mock
	private FilterChain filterChain;
	@Mock
	private CmsPageRequestContextData cmsPageRequestContextData;
	@Mock
	private PreviewDataModel previewDataModel;
	@Mock
	private CMSSiteModel previewSite;
	@Mock
	private LanguageModel languageModel;
	@Mock
	private CMSPreviewTicketModel ticket;

	@Before
	public void setup()
	{
		when(cmsPageContextService.initialiseCmsPageContextForRequest(httpRequest)).thenReturn(cmsPageRequestContextData);
		when(cmsPageRequestContextData.getPreviewData()).thenReturn(previewDataModel);
		when(previewDataModel.getActiveSite()).thenReturn(previewSite);
		when(cmsSiteService.getCurrentSite()).thenReturn(previewSite);
		when(previewSite.getPreviewURL()).thenReturn(PREVIEW_SITE_URL);
		when(previewDataModel.getLanguage()).thenReturn(languageModel);
		when(commerceCommonI18NService.getAllLanguages()).thenReturn(Collections.singletonList(languageModel));
	}

	@Test
	public void givenPreviewServletRequestShouldProcessPreviewDataAndSendRedirect() throws Exception
	{
		final String redirectUrl = PREVIEW_SITE_URL + "&" + PREVIEW_TICKET_ID_PARAM + "=" + TICKET_ID;

		when(httpRequest.getRequestURL()).thenReturn(new StringBuffer(PREVIEW_REQUEST_URL));
		when(cmsPreviewService.createPreviewTicket(previewDataModel)).thenReturn(ticket);
		when(ticket.getId()).thenReturn(TICKET_ID);
		when(httpResponse.encodeRedirectURL(redirectUrl)).thenReturn(redirectUrl);

		cmsSiteFilter.doFilterInternal(httpRequest, httpResponse, filterChain);

		verify(contextInformationLoader).initializePreviewRequest(previewDataModel);
		verify(contextInformationLoader).loadFakeContextInformation(httpRequest, previewDataModel);
		verify(httpResponse).sendRedirect(redirectUrl);
	}

	@Test
	public void givenPreviewContextInRequestShouldProcessPreviewData() throws Exception
	{
		when(httpRequest.getRequestURL()).thenReturn(new StringBuffer(NORMAL_REQUEST_URL));

		cmsSiteFilter.doFilterInternal(httpRequest, httpResponse, filterChain);

		verify(contextInformationLoader).initializePreviewRequest(previewDataModel);
		verify(contextInformationLoader).loadFakeContextInformation(httpRequest, previewDataModel);
	}
}
