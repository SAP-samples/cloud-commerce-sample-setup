/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.filters;


import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.commercefacades.consent.AnonymousConsentFacade;
import de.hybris.platform.commercefacades.consent.data.AnonymousConsentData;
import de.hybris.platform.commercefacades.user.UserFacade;

import javax.servlet.FilterChain;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.mock.web.MockHttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_GIVEN;
import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_WITHDRAWN;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.junit.Assert.assertEquals;
import static org.mockito.AdditionalAnswers.delegatesTo;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@UnitTest
public class ConsentFilterTest
{
	public static final String TEMPLATE_CODE_GIVEN = "templateCodeGiven";
	public static final String TEMPLATE_CODE_WITHDRAWN = "templateCodeWithdrawn";

	private static final ObjectMapper mapper = new ObjectMapper();

	@Spy
	private final HttpServletResponse response = new MockHttpServletResponse();

	@InjectMocks
	private ConsentFilter consentFilter;

	@Mock
	private UserFacade userFacade;
	@Mock
	private AnonymousConsentFacade anonymousConsentFacade;
	@Mock
	private HttpServletRequest request;
	@Mock
	private FilterChain filterChain;

	@Captor
	private ArgumentCaptor<Cookie> cookieCaptor;

	private List<AnonymousConsentData> anonymousConsents;

	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);

		// anonymous consent data setup
		final AnonymousConsentData given = createAnonymousConsent(TEMPLATE_CODE_GIVEN, 1, CONSENT_GIVEN);
		final AnonymousConsentData withdrawn = createAnonymousConsent(TEMPLATE_CODE_WITHDRAWN, 1, CONSENT_WITHDRAWN);
		anonymousConsents = Arrays.asList(given, withdrawn);

		// stubbing callbacks
		doAnswer(delegatesTo((AnonymousConsentFacade) (in, out) -> out.accept(in.get()))) //
				.when(anonymousConsentFacade).synchronizeAnonymousConsents(any(), any());

		// other methods
		when(Boolean.valueOf(userFacade.isAnonymousUser())).thenReturn(Boolean.TRUE);
	}

	@Test
	public void shouldWorkOnlyForAnonymousUser() throws Exception
	{
		// given
		when(Boolean.valueOf(userFacade.isAnonymousUser())).thenReturn(Boolean.FALSE);

		// when
		consentFilter.doFilterInternal(request, response, filterChain);

		// then
		verify(response, times(0)).addCookie(any());
		verify(anonymousConsentFacade, times(0)).synchronizeAnonymousConsents(any(), any());
	}

	@Test
	public void shouldCreateCookieIfNotAlreadyExists() throws Exception
	{
		// given
		when(request.getCookies()).thenReturn(null);

		// when
		consentFilter.doFilterInternal(request, response, filterChain);

		// then
		verify(response).addCookie(any());
	}

	@Test
	public void shouldCreateCookieWhenAnonymousUserVisitsPageFirstTime() throws Exception
	{
		// given
		doAnswer(delegatesTo((AnonymousConsentFacade) (in, out) -> {
			in.get();
			out.accept(anonymousConsents);
		})).when(anonymousConsentFacade).synchronizeAnonymousConsents(any(), any());

		// when
		consentFilter.doFilterInternal(request, response, filterChain);

		// then
		assertAllAnonymousConsentsPresent(TEMPLATE_CODE_GIVEN, TEMPLATE_CODE_WITHDRAWN);
	}

	protected AnonymousConsentData createAnonymousConsent(final String templateCode, final int templateVersion,
			final String consentState)
	{
		final AnonymousConsentData anonymousConsent = new AnonymousConsentData();
		anonymousConsent.setConsentState(consentState);
		anonymousConsent.setTemplateCode(templateCode);
		anonymousConsent.setTemplateVersion(templateVersion);
		return anonymousConsent;
	}

	protected void assertAllAnonymousConsentsPresent(final String... consentsId) throws IOException
	{
		final List<AnonymousConsentData> capturedAnonymousConsents = captureAnonymousConsentsFromCookie();
		assertEquals(capturedAnonymousConsents.size(), consentsId.length);
		for (int i = 0; i < consentsId.length; i++)
		{
			assertEquals(consentsId[i], capturedAnonymousConsents.get(i).getTemplateCode());
		}
	}

	protected final List<AnonymousConsentData> captureAnonymousConsentsFromCookie() throws IOException
	{
		verify(response).addCookie(cookieCaptor.capture());
		final Cookie cookie = cookieCaptor.getValue();
		final String cookieValue = URLDecoder.decode(cookie.getValue(), UTF_8);
		return Arrays.asList(mapper.readValue(cookieValue, AnonymousConsentData[].class));
	}
}
