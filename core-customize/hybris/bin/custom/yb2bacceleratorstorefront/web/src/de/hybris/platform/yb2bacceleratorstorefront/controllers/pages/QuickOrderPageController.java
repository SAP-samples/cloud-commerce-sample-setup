/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.product.data.ProductWrapperData;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.ResourceBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.ThirdPartyConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.servicelayer.exceptions.UnknownIdentifierException;
import de.hybris.platform.util.Config;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Arrays;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


/**
 *
 */
@Controller
@RequestMapping(value = "/quickOrder")
public class QuickOrderPageController extends AbstractPageController
{
	private static final Logger LOG = Logger.getLogger(QuickOrderPageController.class);

	@Resource(name = "simpleBreadcrumbBuilder")
	private ResourceBreadcrumbBuilder resourceBreadcrumbBuilder;

	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;

	@RequestMapping(method = RequestMethod.GET)
	public String getQuickOrderPage(final Model model) throws CMSItemNotFoundException // NOSONAR
	{
		storeCmsPageInModel(model, getContentPageForLabelOrId("quickOrderPage"));
		model.addAttribute("quickOrderMinRows", Integer.valueOf(Config.getInt("yb2bacceleratorstorefront.quick.order.rows.min", 3)));
		model.addAttribute("quickOrderMaxRows", Integer.valueOf(Config.getInt("yb2bacceleratorstorefront.quick.order.rows.max", 25)));
		model.addAttribute(WebConstants.BREADCRUMBS_KEY, resourceBreadcrumbBuilder.getBreadcrumbs("breadcrumb.quickOrder"));
		model.addAttribute(ThirdPartyConstants.SeoRobots.META_ROBOTS, ThirdPartyConstants.SeoRobots.NOINDEX_NOFOLLOW);
		return ControllerConstants.Views.Pages.QuickOrder.QuickOrderPage;
	}

	@RequestMapping(value = "/productInfo", method = RequestMethod.GET, produces = "application/json")
	@ResponseBody
	public ProductWrapperData getProductInfo(@RequestParam("code") final String code)
	{
		ProductData productData = null;
		String errorMsg = null;
		try
		{
			productData = productFacade.getProductForCodeAndOptions(code, Arrays.asList(ProductOption.BASIC, ProductOption.PRICE,
					ProductOption.URL, ProductOption.STOCK, ProductOption.VARIANT_MATRIX_BASE, ProductOption.VARIANT_MATRIX_URL,
					ProductOption.VARIANT_MATRIX_MEDIA));
			if (Boolean.FALSE.equals(productData.getPurchasable()))
			{
				errorMsg = getErrorMessage("text.quickOrder.product.not.purchaseable", null);
			}
		}
		catch (final IllegalArgumentException iae)
		{
			errorMsg = getErrorMessage("text.quickOrder.product.not.unique", null);
			logDebugException(iae);
		}
		catch (final UnknownIdentifierException uie)
		{
			errorMsg = getErrorMessage("text.quickOrder.product.not.found", null);
			logDebugException(uie);
		}

		return createProductWrapperData(productData, errorMsg);
	}

	protected void logDebugException(final Exception ex)
	{
		if (LOG.isDebugEnabled())
		{
			LOG.debug(ex);
		}
	}

	protected String getErrorMessage(final String messageKey, final Object[] args)
	{
		return getMessageSource().getMessage(messageKey, args, getI18nService().getCurrentLocale());
	}

	protected ProductWrapperData createProductWrapperData(final ProductData productData, final String errorMsg)
	{
		final ProductWrapperData productWrapperData = new ProductWrapperData();
		productWrapperData.setProductData(productData);
		productWrapperData.setErrorMsg(errorMsg);
		return productWrapperData;
	}
}
