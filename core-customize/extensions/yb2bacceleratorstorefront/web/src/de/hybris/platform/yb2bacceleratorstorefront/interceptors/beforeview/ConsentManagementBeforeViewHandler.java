/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.interceptors.beforeview;

import de.hybris.platform.acceleratorstorefrontcommons.interceptors.BeforeViewHandler;
import de.hybris.platform.commercefacades.consent.ConsentFacade;
import de.hybris.platform.commercefacades.consent.data.ConsentTemplateData;
import de.hybris.platform.commercefacades.user.UserFacade;
import de.hybris.platform.servicelayer.session.SessionService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.CONSENT_TEMPLATES;
import static de.hybris.platform.commercefacades.constants.CommerceFacadesConstants.USER_CONSENTS;


/**
 * This class is responsible to handle cookie consents for anonymous users. <br/>
 * <br/>
 * It populates the model with the {consentTemplatesToDisplay}:List<ConsentTemplateData>, which are used to render in
 * JSP.<br/>
 * It relies on session values set by {@link de.hybris.platform.yb2bacceleratorstorefront.filters.ConsentFilter}
 */
public class ConsentManagementBeforeViewHandler implements BeforeViewHandler
{
	@Resource(name = "consentFacade")
	private ConsentFacade consentFacade;
	@Resource(name = "sessionService")
	private SessionService sessionService;
	@Resource(name = "userFacade")
	private UserFacade userFacade;

	@Override
	public void beforeView(final HttpServletRequest request, final HttpServletResponse response, final ModelAndView modelAndView)
			throws Exception
	{
		if (!userFacade.isAnonymousUser())
		{
			return;
		}

		// Get templates to display
		final List<ConsentTemplateData> consentTemplatesToDisplay = getConsentTemplatesToDisplay();

		// Add templates to model
		modelAndView.addObject(CONSENT_TEMPLATES, consentTemplatesToDisplay);
	}

	protected List<ConsentTemplateData> getConsentTemplatesToDisplay()
	{
		final Map<String, String> consentMap = sessionService.getAttribute(USER_CONSENTS);

		return getConsentTemplates().stream()//
				.filter(c -> consentMap == null || StringUtils.isEmpty(consentMap.get(c.getId())))//
				.collect(Collectors.toList());
	}

	protected List<ConsentTemplateData> getConsentTemplates()
	{
		List<ConsentTemplateData> consentTemplates = sessionService.getAttribute(CONSENT_TEMPLATES);
		if (consentTemplates == null)
		{
			consentTemplates = consentFacade.getConsentTemplatesWithConsents().stream().filter(ConsentTemplateData::isExposed)
					.collect(Collectors.toList());
			sessionService.setAttribute(CONSENT_TEMPLATES, consentTemplates);
		}
		return consentTemplates;
	}
}
