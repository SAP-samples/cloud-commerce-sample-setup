/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.web.view;

import de.hybris.platform.acceleratorservices.uiexperience.UiExperienceService;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.commerceservices.enums.UiExperienceLevel;

import java.util.Locale;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.web.servlet.view.AbstractUrlBasedView;
import org.springframework.web.servlet.view.InternalResourceView;
import org.springframework.web.servlet.view.InternalResourceViewResolver;


/**
 * A view resolver that detects the device a request is coming from and directs it to the appropriate view. This view
 * resolver extends Spring's org.springframework.web.servlet.view.InternalResourceViewResolver.
 */
public class UiExperienceViewResolver extends InternalResourceViewResolver
{
	private static final Logger LOG = Logger.getLogger(UiExperienceViewResolver.class);

	private static final String ADDON = "addon:";
	private UiExperienceService uiExperienceService;
	private Map<UiExperienceLevel, String> uiExperienceViewPrefix;
	private String unknownUiExperiencePrefix;
	private String addOnPrefix;

	protected UiExperienceService getUiExperienceService()
	{
		return uiExperienceService;
	}

	@Required
	public void setUiExperienceService(final UiExperienceService uiExperienceService)
	{
		this.uiExperienceService = uiExperienceService;
	}

	public Map<UiExperienceLevel, String> getUiExperienceViewPrefix()
	{
		return uiExperienceViewPrefix;
	}

	@Required
	public void setUiExperienceViewPrefix(final Map<UiExperienceLevel, String> uiExperienceViewPrefix)
	{
		this.uiExperienceViewPrefix = uiExperienceViewPrefix;
	}

	protected String getUnknownUiExperiencePrefix()
	{
		return unknownUiExperiencePrefix;
	}

	@Required
	public void setUnknownUiExperiencePrefix(final String unknownUiExperiencePrefix)
	{
		this.unknownUiExperiencePrefix = unknownUiExperiencePrefix;
	}

	protected String getAddOnPrefix()
	{
		return addOnPrefix;
	}

	@Required
	public void setAddOnPrefix(final String addOnPrefix)
	{
		this.addOnPrefix = addOnPrefix;
	}

	@Override
	protected Object getCacheKey(final String viewName, final Locale locale)
	{
		// Incorporate the UiExperienceLevel into the view cache
		return super.getCacheKey(viewName, locale) + "_" + getUiExperienceService().getUiExperienceLevel().getCode();
	}

	@Override
	protected AbstractUrlBasedView buildView(final String viewName) throws Exception
	{
		final UiExperienceLevel uiExperienceLevel = getUiExperienceService().getUiExperienceLevel();
		final String expandedViewName = getViewName(uiExperienceLevel, viewName);

		if (LOG.isDebugEnabled())
		{
			LOG.debug("Expanded View Name [" + viewName + "] into [" + expandedViewName + "]");
		}

		final InternalResourceView view = (InternalResourceView) super.buildView(expandedViewName);
		view.setAlwaysInclude(false);
		return view;
	}

	public String getViewName(final UiExperienceLevel uiExperienceLevel, final String viewName)
	{
		String properViewName = viewName;
		final String prefix = getUiExperienceViewPrefix().get(uiExperienceLevel);
		if (prefix != null)
		{
			if (viewName.startsWith(AbstractPageController.PAGE_ROOT + ADDON))
			{
				properViewName = viewName.replace(AbstractPageController.PAGE_ROOT + ADDON, ADDON); // ...pages/addon:/<extension-name>/.../<component-view>....->....addon:/<extension-name>/.../<component-view>
			}

			if (properViewName.startsWith(ADDON))
			{
				properViewName = properViewName.replace(ADDON, ""); // ................................addon:/<extension-name>/cms/<component-view>....->..../<extension-name>/cms/<component-view>
				properViewName = properViewName.substring(1, properViewName.length()); // ....................../<extension-name>/cms/<component-view>..........->....<extension-name>/cms/<component-view>
				final String extensionName = properViewName.substring(0, properViewName.indexOf('/')); // <extension-name>/cms/<component-view>...........->....<extension-name>
				properViewName = properViewName.substring(properViewName.indexOf('/'), properViewName.length()); // ..<extension-name>/cms/<component-view>...........->..../cms/<component-view>
				return getAddOnPrefix() + extensionName + "/" + StringUtils.remove(prefix, "/") + properViewName; // ..<addon-prefix>/<extension-name>/<ui-prefix>/cms/<component-view>
			}
			return prefix + properViewName;
		}
		return getUnknownUiExperiencePrefix() + properViewName;
	}
}
