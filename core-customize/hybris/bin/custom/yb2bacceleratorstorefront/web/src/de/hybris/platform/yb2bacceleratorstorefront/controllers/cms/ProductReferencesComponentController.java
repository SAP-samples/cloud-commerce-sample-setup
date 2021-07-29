/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import de.hybris.platform.acceleratorcms.model.components.ProductReferencesComponentModel;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductReferenceData;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


/**
 * Controller for CMS ProductReferencesComponent
 */
@Controller("ProductReferencesComponentController")
@RequestMapping(value = ControllerConstants.Actions.Cms.ProductReferencesComponent)
public class ProductReferencesComponentController extends
		AbstractAcceleratorCMSComponentController<ProductReferencesComponentModel>
{
	protected static final List<ProductOption> PRODUCT_OPTIONS = Arrays.asList(ProductOption.BASIC, ProductOption.PRICE);

	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;

	@Override
	protected void fillModel(final HttpServletRequest request, final Model model, final ProductReferencesComponentModel component)
	{
		final ProductModel currentProduct = getRequestContextData(request).getProduct();
		if (currentProduct != null)
		{
			final List<ProductReferenceData> productReferences = productFacade.getProductReferencesForCode(currentProduct.getCode(),
					component.getProductReferenceTypes(), PRODUCT_OPTIONS, component.getMaximumNumberProducts());

			model.addAttribute("title", component.getTitle());
			model.addAttribute("productReferences", productReferences);
		}
	}
}
