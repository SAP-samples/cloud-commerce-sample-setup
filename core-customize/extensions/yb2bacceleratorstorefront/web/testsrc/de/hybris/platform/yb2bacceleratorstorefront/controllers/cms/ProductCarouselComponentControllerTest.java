/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;


import static de.hybris.platform.cms2.misc.CMSFilter.PREVIEW_TICKET_ID_PARAM;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.productcarousel.ProductCarouselFacade;
import de.hybris.platform.category.model.CategoryModel;
import de.hybris.platform.cms2lib.model.components.ProductCarouselComponentModel;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.servicelayer.session.SessionService;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;


/**
 * Unit test for {@link ProductCarouselComponentController}
 */
@UnitTest
public class ProductCarouselComponentControllerTest
{
	private static final String CODE_CATEGORIES = "codeProdCategories";
	private static final String CODE_PRODUCT = "codeProdProduct";
	private static final String COMPONENT_TITLE = "componentTitle";

	@Mock
	private ProductFacade productFacade;
	@Mock
	private SessionService sessionService;
	@Mock
	private ProductCarouselFacade productCarouselFacade;

	@InjectMocks
	private final ProductCarouselComponentController productCarouselComponentController = new ProductCarouselComponentController();

	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void testFillModel()
	{
		given(sessionService.getAttribute(PREVIEW_TICKET_ID_PARAM)).willReturn(null);

		final HttpServletRequest request = mock(HttpServletRequest.class);
		final Model model = mock(Model.class);
		final ProductCarouselComponentModel component = mock(ProductCarouselComponentModel.class);
		final ProductModel productModelProducts = mock(ProductModel.class);
		final ProductModel productModelCategories = mock(ProductModel.class);
		final ProductData productData = mock(ProductData.class);
		final CategoryModel categoryModel = mock(CategoryModel.class);
		given(productModelCategories.getCode()).willReturn(CODE_CATEGORIES);
		given(productModelProducts.getCode()).willReturn(CODE_PRODUCT);
		given(component.getProducts()).willReturn(Collections.singletonList(productModelProducts));
		given(component.getCategories()).willReturn(Collections.singletonList(categoryModel));
		given(categoryModel.getProducts()).willReturn(Collections.singletonList(productModelCategories));
		given(component.getTitle()).willReturn(COMPONENT_TITLE);
		given(productCarouselFacade.collectProducts(component)).willReturn(Collections.singletonList(productData));

		productCarouselComponentController.fillModel(request, model, component);
		verify(model).addAttribute("title", COMPONENT_TITLE);
		verify(model).addAttribute(Mockito.same("productData"), Mockito.anyListOf(ProductData.class));
	}

	class OptionsMatcher extends ArgumentMatcher
	{
		@Override
		public boolean matches(final Object object)
		{
			if (object instanceof List)
			{
				final List<ProductOption> options = (List<ProductOption>) object;
				if (options.size() != 2)
				{
					return false;
				}
				if (!options.get(0).equals(ProductOption.BASIC))
				{
					return false;
				}
				if (!options.get(1).equals(ProductOption.PRICE))
				{
					return false;
				}
				return true;
			}
			return false;
		}
	}
}
