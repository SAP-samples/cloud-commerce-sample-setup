/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.model.components.DynamicBannerComponentModel;
import de.hybris.platform.catalog.CatalogVersionService;
import de.hybris.platform.catalog.model.CatalogVersionModel;
import de.hybris.platform.category.model.CategoryModel;
import de.hybris.platform.core.model.media.MediaModel;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.servicelayer.media.MediaService;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Controller for CMS DynamicBannerComponent
 */
@Controller("DynamicBannerComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.DynamicBannerComponent)
public class DynamicBannerComponentController extends AbstractAcceleratorCMSComponentController<DynamicBannerComponentModel>
{
	@SuppressWarnings("unused")
	private static final Logger LOG = Logger.getLogger(DynamicBannerComponentController.class);

	private static final String MEDIA_PATTERN_TOKEN = "\\{VARIABLE\\}";

	@Resource(name = "mediaService")
	private MediaService mediaService;

	@Resource(name = "catalogVersionService")
	private CatalogVersionService catalogVersionService;


	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final DynamicBannerComponentModel component)
	{
		final CategoryModel categoryModel = getRequestContextData(request).getCategory();
		if (categoryModel != null)
		{
			final String mediaCode = getMediaCodeFromPattern(component, categoryModel);
			final MediaModel media = getMediaByCode(mediaCode);
			if (media != null)
			{
				model.addAttribute("media", media);
			}
			else
			{
				model.addAttribute("media", component.getMedia());
			}
			model.addAttribute("content", categoryModel.getDescription());
			model.addAttribute("title", categoryModel.getName());
		}
	}

	protected String getMediaCodeFromPattern(final DynamicBannerComponentModel component, final CategoryModel categoryModel)
	{
		final String mediaCodePattern = component.getMediaCodePattern();
		if (mediaCodePattern != null && !mediaCodePattern.isEmpty())
		{
			return mediaCodePattern.replaceAll(MEDIA_PATTERN_TOKEN, categoryModel.getCode());
		}
		return null;
	}

	protected MediaModel getMediaByCode(final String mediaCode)
	{
		if (StringUtils.isNotEmpty(mediaCode))
		{
			for (final CatalogVersionModel catalogVersionModel : catalogVersionService.getSessionCatalogVersions())
			{
				final MediaModel media = getMediaByCodeAndCatalogVersion(mediaCode, catalogVersionModel);
				if (media != null)
				{
					return media;
				}
			}
		}
		return null;
	}

	protected MediaModel getMediaByCodeAndCatalogVersion(final String mediaCode, final CatalogVersionModel catalogVersionModel)
	{
		try
		{
			return mediaService.getMedia(catalogVersionModel, mediaCode);
		}
		catch (final UnknownIdentifierException ignore)
		{
			// Ignore this exception
		}
		return null;
	}
}
