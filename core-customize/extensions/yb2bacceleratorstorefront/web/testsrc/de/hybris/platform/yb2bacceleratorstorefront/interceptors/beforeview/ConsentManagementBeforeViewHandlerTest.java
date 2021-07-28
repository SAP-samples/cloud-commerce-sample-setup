/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;


import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.commercefacades.consent.ConsentFacade;
import de.hybris.platform.commercefacades.consent.data.ConsentData;
import de.hybris.platform.commercefacades.consent.data.ConsentTemplateData;
import de.hybris.platform.commercefacades.user.UserFacade;
import de.hybris.platform.servicelayer.session.SessionService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.Spy;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.servlet.ModelAndView;

import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_GIVEN;
import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_TEMPLATES;
import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_WITHDRAWN;
import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.USER_CONSENTS;
import static de.hybris.platform.testframework.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@UnitTest
public class ConsentManagementBeforeViewHandlerTest
{
	public static final String TEMPLATE_CODE_GIVEN = "templateCodeGiven";
	public static final String TEMPLATE_CODE_WITHDRAWN = "templateCodeWithdrawn";
	public static final String TEMPLATE_NO_STATE = "empty";
	private List<ConsentTemplateData> consentTemplateDataNoState;
	private List<ConsentTemplateData> consentTemplateData;
	private ConsentTemplateData givenTemplate;
	private ConsentTemplateData withdrawnTemplate;
	private ConsentTemplateData emptyTemplate;

	@InjectMocks
	private ConsentManagementBeforeViewHandler consentManagementBeforeViewHandler;

	@Mock
	private ConsentFacade consentFacade;
	@Mock
	private SessionService sessionService;
	@Mock
	private UserFacade userFacade;
	@Mock
	private HttpServletRequest request;
	@Spy
	private final HttpServletResponse response = new MockHttpServletResponse();
	@Spy
	private final ModelAndView modelAndView = new ModelAndView();

	@Before
	public void setUp() throws IOException
	{
		MockitoAnnotations.initMocks(this);

		// consent template data setup
		final ConsentData givenConsent = ConsentDataBuilder.aConsentData()//
				.withCode("given")//
				.withConsentGivenDate(new Date())//
				.build();
		givenTemplate = ConsentTemplateDataBuilder.aConsentTemplateData()//
				.withId(TEMPLATE_CODE_GIVEN)//
				.withConsentData(givenConsent)//
				.withVersion(1)//
				.withExposed(true)//
				.withDescription("given")//
				.build();

		final ConsentData withdrawnConsent = ConsentDataBuilder.aConsentData()//
				.withCode("withdrawn")//
				.withConsentGivenDate(new Date())//
				.withConsentWithdrawnDate(new Date())//
				.build();
		withdrawnTemplate = ConsentTemplateDataBuilder.aConsentTemplateData()//
				.withId(TEMPLATE_CODE_WITHDRAWN)//
				.withConsentData(withdrawnConsent)//
				.withVersion(1)//
				.withExposed(true)//
				.withDescription("withdrawn")//
				.build();

		consentTemplateData = Arrays.asList(givenTemplate, withdrawnTemplate);

		emptyTemplate = ConsentTemplateDataBuilder.aConsentTemplateData()//
				.withId(TEMPLATE_NO_STATE)//
				.withVersion(1)//
				.withExposed(true)//
				.withDescription("empty")//
				.build();

		consentTemplateDataNoState = Arrays.asList(emptyTemplate);

		// other methods
		when(Boolean.valueOf(userFacade.isAnonymousUser())).thenReturn(Boolean.TRUE);
	}


	@Test
	public void shouldWorkOnlyForAnonymousUser() throws Exception
	{
		//given
		when(Boolean.valueOf(userFacade.isAnonymousUser())).thenReturn(Boolean.FALSE);

		//when
		consentManagementBeforeViewHandler.beforeView(request, response, modelAndView);

		//then
		verify(modelAndView, times(0)).addObject(eq(CONSENT_TEMPLATES), any());
	}

	@Test
	public void shouldNotPopulateTheModelIfConsentsHasState() throws Exception
	{
		//given
		final Map<String, String> sessionConsents = new HashMap<>();
		sessionConsents.put(TEMPLATE_CODE_GIVEN, CONSENT_GIVEN);
		sessionConsents.put(TEMPLATE_CODE_WITHDRAWN, CONSENT_WITHDRAWN);

		when(sessionService.getAttribute(USER_CONSENTS)).thenReturn(sessionConsents);
		when(consentFacade.getConsentTemplatesWithConsents()).thenReturn(consentTemplateData);

		//when
		consentManagementBeforeViewHandler.beforeView(request, response, modelAndView);

		//then
		// verify consentTemplateData was NOT added to model
		verify(modelAndView).addObject(CONSENT_TEMPLATES, Collections.emptyList());
		// verify consentTemplateData was NOT added to model
		assertTrue(modelAndView.getModelMap().get(CONSENT_TEMPLATES).equals(Collections.emptyList()));
	}

	@Test
	public void shouldPopulateTheModelIfConsentHasNoState() throws Exception
	{
		//given
		final Map<String, String> sessionConsents = new HashMap<>();
		sessionConsents.put(TEMPLATE_NO_STATE, null);

		when(sessionService.getAttribute(USER_CONSENTS)).thenReturn(sessionConsents);
		when(sessionService.getAttribute(CONSENT_TEMPLATES)).thenReturn(consentTemplateDataNoState);

		//when
		consentManagementBeforeViewHandler.beforeView(request, response, modelAndView);

		//then
		// verify consentTemplateData was added to model
		verify(modelAndView).addObject(eq(CONSENT_TEMPLATES), any());
		// verify consentTemplateData was added to model
		assertTrue(modelAndView.getModelMap().get(CONSENT_TEMPLATES).equals(consentTemplateDataNoState));
	}

	@Test
	public void shouldPopulateModelIfNoConsentInSession() throws Exception
	{
		//given
		when(consentFacade.getConsentTemplatesWithConsents()).thenReturn(consentTemplateData);

		//when
		consentManagementBeforeViewHandler.beforeView(request, response, modelAndView);

		//then
		assertConsentTemplatesAddedToModel();
	}

	@Test
	public void shouldFilterOutConsentsThatWasAcceptedOrDeclined() throws Exception
	{
		//given
		final Map<String, String> sessionConsents = new HashMap<>();
		sessionConsents.put(TEMPLATE_CODE_GIVEN, CONSENT_GIVEN);
		sessionConsents.put(TEMPLATE_CODE_WITHDRAWN, CONSENT_WITHDRAWN);
		sessionConsents.put(TEMPLATE_NO_STATE, null);

		when(sessionService.getAttribute(USER_CONSENTS)).thenReturn(sessionConsents);
		when(sessionService.getAttribute(CONSENT_TEMPLATES)).thenReturn(getConsentTemplateData());
		when(consentFacade.getConsentTemplatesWithConsents()).thenReturn(consentTemplateData);

		//when
		consentManagementBeforeViewHandler.beforeView(request, response, modelAndView);

		//then
		assertOnlyNullConsentsInModel();
	}

	protected List<ConsentTemplateData> getConsentTemplateData()
	{
		return Arrays.asList(givenTemplate, withdrawnTemplate, emptyTemplate);
	}

	protected void assertOnlyNullConsentsInModel()
	{
		final ArgumentCaptor<List> attributesCaptor = ArgumentCaptor.forClass(List.class);
		verify(modelAndView).addObject(eq(CONSENT_TEMPLATES), Collections.singletonList(attributesCaptor.capture()));
		final List<ConsentTemplateData> consentTemplateData = attributesCaptor.getValue();
		assertTrue(consentTemplateData.size() == 1);
		assertTrue(consentTemplateData.get(0).getConsentData() == null);
	}


	protected void assertConsentTemplatesAddedToModel()
	{
		final ArgumentCaptor<List> attributesCaptor = ArgumentCaptor.forClass(List.class);
		verify(modelAndView).addObject(eq(CONSENT_TEMPLATES), Collections.singletonList(attributesCaptor.capture()));
		final List<ConsentTemplateData> consentTemplateData = attributesCaptor.getValue();
		assertTrue(consentTemplateData.size() == 2);
		assertEquals(consentTemplateData.get(0).getId(), TEMPLATE_CODE_GIVEN);
		assertEquals(consentTemplateData.get(1).getId(), TEMPLATE_CODE_WITHDRAWN);
	}

}

class ConsentDataBuilder
{
	private String code;

	private Date consentGivenDate;

	private Date consentWithdrawnDate;

	private ConsentDataBuilder()
	{
	}

	public static ConsentDataBuilder aConsentData()
	{
		return new ConsentDataBuilder();
	}

	public ConsentDataBuilder withCode(final String templateCode)
	{
		this.code = templateCode;
		return this;
	}

	public ConsentDataBuilder withConsentGivenDate(final Date consentGivenDate)
	{
		this.consentGivenDate = consentGivenDate;
		return this;
	}

	public ConsentDataBuilder withConsentWithdrawnDate(final Date consentWithdrawnDate)
	{
		this.consentWithdrawnDate = consentWithdrawnDate;
		return this;
	}

	public ConsentData build()
	{
		final ConsentData consentData = new ConsentData();
		consentData.setCode(code);
		consentData.setConsentGivenDate(consentGivenDate);
		consentData.setConsentWithdrawnDate(consentWithdrawnDate);
		return consentData;
	}
}

class ConsentTemplateDataBuilder
{
	private String id;

	private String name;

	private String description;

	private int version;

	private boolean exposed;

	private ConsentData consentData;

	private ConsentTemplateDataBuilder()
	{
	}

	public static ConsentTemplateDataBuilder aConsentTemplateData()
	{
		return new ConsentTemplateDataBuilder();
	}

	public ConsentTemplateDataBuilder withId(final String id)
	{
		this.id = id;
		return this;
	}

	public ConsentTemplateDataBuilder withName(final String name)
	{
		this.name = name;
		return this;
	}

	public ConsentTemplateDataBuilder withDescription(final String description)
	{
		this.description = description;
		return this;
	}

	public ConsentTemplateDataBuilder withVersion(final int version)
	{
		this.version = version;
		return this;
	}

	public ConsentTemplateDataBuilder withExposed(final boolean exposed)
	{
		this.exposed = exposed;
		return this;
	}

	public ConsentTemplateDataBuilder withConsentData(final ConsentData consentData)
	{
		this.consentData = consentData;
		return this;
	}

	public ConsentTemplateData build()
	{
		final ConsentTemplateData consentTemplateData = new ConsentTemplateData();
		consentTemplateData.setId(id);
		consentTemplateData.setName(name);
		consentTemplateData.setDescription(description);
		consentTemplateData.setVersion(Integer.valueOf(version));
		consentTemplateData.setExposed(exposed);
		consentTemplateData.setConsentData(consentData);
		return consentTemplateData;
	}
}


