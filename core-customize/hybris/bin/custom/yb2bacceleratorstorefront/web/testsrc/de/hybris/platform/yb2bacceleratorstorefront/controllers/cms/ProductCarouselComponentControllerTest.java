/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;


import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.productcarousel.ProductCarouselFacade;
import de.hybris.platform.cms2lib.model.components.ProductCarouselComponentModel;
import de.hybris.platform.commercefacades.product.data.ProductData;

import java.util.Collections;

import javax.servlet.http.HttpServletRequest;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.ui.Model;


/**
 * Unit test for {@link ProductCarouselComponentController}
 */
@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class ProductCarouselComponentControllerTest
{
	private static final String COMPONENT_TITLE = "componentTitle";

	@Mock
	private ProductCarouselFacade productCarouselFacade;

	@InjectMocks
	private final ProductCarouselComponentController productCarouselComponentController = new ProductCarouselComponentController();

	@Test
	public void testFillModel()
	{

		final HttpServletRequest request = mock(HttpServletRequest.class);
		final Model model = mock(Model.class);
		final ProductCarouselComponentModel component = mock(ProductCarouselComponentModel.class);
		final ProductData productData = mock(ProductData.class);
		given(component.getTitle()).willReturn(COMPONENT_TITLE);
		given(productCarouselFacade.collectProducts(component)).willReturn(Collections.singletonList(productData));

		productCarouselComponentController.fillModel(request, model, component);
		verify(model).addAttribute("title", COMPONENT_TITLE);
		verify(model).addAttribute(Mockito.same("productData"), Mockito.anyList());
	}

}
