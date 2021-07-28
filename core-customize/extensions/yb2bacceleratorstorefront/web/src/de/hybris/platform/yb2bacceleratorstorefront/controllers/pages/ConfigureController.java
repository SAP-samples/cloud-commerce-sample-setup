/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.order.data.ConfigurationInfoData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.url.UrlResolver;

import java.io.UnsupportedEncodingException;
import java.util.Collections;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


/**
 * The controller redirects to specific configuration page. If product is configurable the controller takes first one
 * configuration and use its type for redirect. If product is not configurable the controller redirect to 404 page.
 */
@Controller
@RequestMapping(value = "/**/p/{productCode:.*}/configuratorPage")
public class ConfigureController extends AbstractPageController
{
	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;


	@Resource(name = "productDataUrlResolver")
	private UrlResolver<ProductData> productDataUrlResolver;

	@RequestMapping(method = RequestMethod.GET)
	public String productDetail(@PathVariable("productCode") final String productCode, final Model model,
			final HttpServletRequest request, final HttpServletResponse response)
			throws CMSItemNotFoundException, UnsupportedEncodingException
	{
		String redirectTo = "";
		final ProductData productData = productFacade.getProductForCodeAndOptions(productCode,
				Collections.singleton(ProductOption.GALLERY));

		if (productData.getConfigurable())
		{
			final List<ConfigurationInfoData> configurations = productFacade.getConfiguratorSettingsForCode(productData.getCode());
			if (!configurations.isEmpty())
			{
				redirectTo = configurations.get(0).getConfiguratorType().toString();
			}
		}

		final String redirection = checkRequestUrl(request, response, productDataUrlResolver.resolve(productData));
		if (StringUtils.isNotEmpty(redirection))
		{
			return redirection + "/configuratorPage/" + redirectTo;
		}
		return FORWARD_PREFIX + "/404";
	}
}
