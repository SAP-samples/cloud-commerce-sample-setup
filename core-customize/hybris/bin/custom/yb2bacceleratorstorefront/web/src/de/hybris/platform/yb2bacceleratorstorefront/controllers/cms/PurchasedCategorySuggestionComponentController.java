/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.model.components.PurchasedCategorySuggestionComponentModel;
import de.hybris.platform.acceleratorcms.model.components.SimpleSuggestionComponentModel;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.cms.AbstractCMSComponentController;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.yacceleratorfacades.suggestion.SimpleSuggestionFacade;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Controller for CMS PurchasedCategorySuggestionComponent
 */
@Controller("PurchasedCategorySuggestionComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.PurchasedCategorySuggestionComponent)
public class PurchasedCategorySuggestionComponentController extends
		AbstractCMSComponentController<PurchasedCategorySuggestionComponentModel>
{
	@Resource(name = "simpleSuggestionFacade")
	private SimpleSuggestionFacade simpleSuggestionFacade;

	@Override
	protected void fillModel(final HttpServletRequest request, final Model model,
			final PurchasedCategorySuggestionComponentModel component)
	{
		final List<ProductData> productSuggestions = simpleSuggestionFacade
				.getReferencesForPurchasedInCategory(component.getCategory().getCode(), component.getProductReferenceTypes(),
						component.isFilterPurchased(), component.getMaximumNumberProducts());

		model.addAttribute("title", component.getTitle());
		model.addAttribute("suggestions", productSuggestions);
	}

	@Override
	protected String getView(final PurchasedCategorySuggestionComponentModel component)
	{
		return ControllerConstants.Views.Cms.ComponentPrefix + StringUtils.lowerCase(SimpleSuggestionComponentModel._TYPECODE);
	}
}
