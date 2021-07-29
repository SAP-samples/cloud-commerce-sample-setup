/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.url.UrlResolver;

import java.io.UnsupportedEncodingException;
import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class ConfigureControllerTest
{
	private static final String PRODUCT_CODE = "ABC+ ^%$#@!*&%2B";

	@Mock
	private ProductFacade productFacade;

	@Mock
	private UrlResolver<ProductData> productDataUrlResolver;

	@InjectMocks
	private ConfigureController controller;

	private final MockHttpServletRequest request = new MockHttpServletRequest();
	private final MockHttpServletResponse response = new MockHttpServletResponse();
	private final ProductData productData = new ProductData();

	@Before
	public void prepare()
	{
		when(productFacade.getProductForCodeAndOptions(anyString(), any())).thenReturn(productData);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed() throws CMSItemNotFoundException, UnsupportedEncodingException
	{
		productData.setConfigurable(false);

		controller.productDetail(PRODUCT_CODE, null, request, response);

		verify(productFacade).getProductForCodeAndOptions(PRODUCT_CODE, Collections.singleton(ProductOption.GALLERY));
	}
}
