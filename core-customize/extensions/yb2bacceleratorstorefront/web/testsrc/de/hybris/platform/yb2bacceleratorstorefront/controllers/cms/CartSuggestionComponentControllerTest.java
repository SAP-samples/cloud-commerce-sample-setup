/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorcms.model.components.CartSuggestionComponentModel;
import de.hybris.platform.acceleratorcms.model.components.SimpleSuggestionComponentModel;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.catalog.enums.ProductReferenceTypeEnum;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.servicelayer.services.impl.DefaultCMSComponentService;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.order.impl.DefaultCartFacade;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.yacceleratorfacades.suggestion.SimpleSuggestionFacade;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import junit.framework.Assert;

import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.ui.Model;


/**
 * Unit test for {@link CartSuggestionComponentController}
 */
@UnitTest
public class CartSuggestionComponentControllerTest
{
	private static final String COMPONENT_UID = "componentUid";
	private static final String TEST_COMPONENT_UID = "componentUID";
	private static final String TEST_TYPE_CODE = SimpleSuggestionComponentModel._TYPECODE;
	private static final String TEST_TYPE_VIEW = ControllerConstants.Views.Cms.ComponentPrefix
			+ StringUtils.lowerCase(TEST_TYPE_CODE);
	private static final String TITLE = "title";
	private static final String TITLE_VALUE = "Accessories";
	private static final String SUGGESTIONS = "suggestions";
	private static final String COMPONENT = "component";

	private CartSuggestionComponentController cartSuggestionComponentController;

	@Mock
	private CartSuggestionComponentModel cartSuggestionComponentModel;
	@Mock
	private Model model;
	@Mock
	private DefaultCMSComponentService cmsComponentService;
	@Mock
	private SimpleSuggestionFacade simpleSuggestionFacade;
	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ProductData productData;
	@Mock
	private DefaultCartFacade cartFacade;

	private final List<ProductData> productDataList = Collections.singletonList(productData);


	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);

		cartSuggestionComponentController = new CartSuggestionComponentController();
		cartSuggestionComponentController.setCmsComponentService(cmsComponentService);
		ReflectionTestUtils.setField(cartSuggestionComponentController, "simpleSuggestionFacade", simpleSuggestionFacade);
		ReflectionTestUtils.setField(cartSuggestionComponentController, "cartFacade", cartFacade);

		given(cartFacade.hasSessionCart()).willReturn(Boolean.TRUE);
		final CartData cartData = Mockito.mock(CartData.class);
		when(cartFacade.getSessionCart()).thenReturn(cartData);

		final List<OrderEntryData> listData = new ArrayList<OrderEntryData>();
		final OrderEntryData entryData = Mockito.mock(OrderEntryData.class);
		when(entryData.getProduct()).thenReturn(productData);
		listData.add(entryData);
		when(cartData.getEntries()).thenReturn(listData);
	}

	@Test
	public void testRenderComponent()
	{
		given(cartSuggestionComponentModel.getMaximumNumberProducts()).willReturn(Integer.valueOf(1));
		given(cartSuggestionComponentModel.getTitle()).willReturn(TITLE_VALUE);
		given(cartSuggestionComponentModel.getProductReferenceTypes()).willReturn(
				Arrays.asList(ProductReferenceTypeEnum.ACCESSORIES));
		given(Boolean.valueOf(cartSuggestionComponentModel.isFilterPurchased())).willReturn(Boolean.TRUE);
		given(cartSuggestionComponentModel.getMaximumNumberProducts()).willReturn(Integer.valueOf(10));

		given(
				simpleSuggestionFacade.getSuggestionsForProductsInCart(Mockito.anyListOf(ProductReferenceTypeEnum.class),
						Mockito.eq(true), Mockito.eq(10))).willReturn(productDataList);
		given(request.getAttribute(COMPONENT)).willReturn(cartSuggestionComponentModel);

		final String viewName = cartSuggestionComponentController.handleGet(request, response, model);
		verify(model, Mockito.times(1)).addAttribute(COMPONENT, cartSuggestionComponentModel);
		verify(model, Mockito.times(1)).addAttribute(TITLE, TITLE_VALUE);
		verify(model, Mockito.times(1)).addAttribute(SUGGESTIONS, productDataList);
		Assert.assertEquals(TEST_TYPE_VIEW, viewName);
	}

	@Test
	public void testRenderComponentUid() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getAbstractCMSComponent(TEST_COMPONENT_UID)).willReturn(cartSuggestionComponentModel);
		given(cartSuggestionComponentModel.getMaximumNumberProducts()).willReturn(Integer.valueOf(1));
		given(cartSuggestionComponentModel.getTitle()).willReturn(TITLE_VALUE);
		given(cartSuggestionComponentModel.getProductReferenceTypes()).willReturn(
				Arrays.asList(ProductReferenceTypeEnum.ACCESSORIES));
		given(Boolean.valueOf(cartSuggestionComponentModel.isFilterPurchased())).willReturn(Boolean.TRUE);

		given(
				simpleSuggestionFacade.getSuggestionsForProductsInCart(Mockito.anyListOf(ProductReferenceTypeEnum.class),
						Mockito.eq(true), Mockito.eq(1))).willReturn(productDataList);

		final String viewName = cartSuggestionComponentController.handleGet(request, response, model);
		verify(model, Mockito.times(1)).addAttribute(COMPONENT, cartSuggestionComponentModel);
		verify(model, Mockito.times(1)).addAttribute(TITLE, TITLE_VALUE);
		verify(model, Mockito.times(1)).addAttribute(SUGGESTIONS, productDataList);
		Assert.assertEquals(TEST_TYPE_VIEW, viewName);
	}

	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound()
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(null);
		given(request.getParameter(COMPONENT_UID)).willReturn(null);
		cartSuggestionComponentController.handleGet(request, response, model);
	}

	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound2() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(null);
		given(request.getParameter(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willReturn(null);
		cartSuggestionComponentController.handleGet(request, response, model);
	}

	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound3() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willReturn(null);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willThrow(new CMSItemNotFoundException(""));
		cartSuggestionComponentController.handleGet(request, response, model);
	}
}
