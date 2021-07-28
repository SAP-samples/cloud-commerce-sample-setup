/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.model.components.CategoryFeatureComponentModel;
import de.hybris.platform.category.model.CategoryModel;
import de.hybris.platform.commercefacades.product.data.CategoryData;
import de.hybris.platform.servicelayer.dto.converter.Converter;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Controller for CMS ProductFeatureComponent.
 */
@Controller("CategoryFeatureComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.CategoryFeatureComponent)
public class CategoryFeatureComponentController extends AbstractAcceleratorCMSComponentController<CategoryFeatureComponentModel>
{
	@Resource(name = "categoryUrlConverter")
	private Converter<CategoryModel, CategoryData> categoryUrlConverter;

	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final CategoryFeatureComponentModel component)
	{
		final CategoryModel category = component.getCategory();
		if (category != null)
		{
			final String url = categoryUrlConverter.convert(category).getUrl();
			model.addAttribute("url", url);
		}
	}
}
