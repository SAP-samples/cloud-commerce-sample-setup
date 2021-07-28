/*
 * Copyright (c) 2019 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.cms;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorcms.model.components.ProductReferencesComponentModel;
import de.hybris.platform.acceleratorservices.data.RequestContextData;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractPageController;
import de.hybris.platform.catalog.enums.ProductReferenceTypeEnum;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.servicelayer.services.impl.DefaultCMSComponentService;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.data.ProductReferenceData;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import junit.framework.Assert;

import org.apache.commons.lang.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.ui.Model;


/**
 * Unit test for {@link ProductReferencesComponentController}
 */
@UnitTest
public class ProductReferencesComponentControllerTest
{
	private static final String COMPONENT_UID = "componentUid";
	private static final String TEST_COMPONENT_UID = "componentUID";
	private static final String TEST_TYPE_CODE = "myTypeCode";
	private static final String TEST_TYPE_VIEW = ControllerConstants.Views.Cms.ComponentPrefix
			+ StringUtils.lowerCase(TEST_TYPE_CODE);
	private static final String TITLE = "title";
	private static final String TITLE_VALUE = "Accessories";
	private static final String PRODUCT_REFERENCES = "productReferences";
	private static final String COMPONENT = "component";



	@Mock
	private ProductReferencesComponentModel productReferencesComponentModel;
	@Mock
	private Model model;
	@Mock
	private DefaultCMSComponentService cmsComponentService;
	@Mock
	private ProductFacade productFacade;
	@Mock
	private HttpServletRequest request;
	@Mock
	private HttpServletResponse response;
	@Mock
	private ProductReferenceData productReferenceData;

	private final RequestContextData requestContextData = new RequestContextData();

	private final List<ProductReferenceData> productReferenceDataList = Collections.singletonList(productReferenceData);

	@InjectMocks
	private final ProductReferencesComponentController productReferencesComponentController = new ProductReferencesComponentController()
	{
		@Override
		protected RequestContextData getRequestContextData(final HttpServletRequest request)
		{
			return requestContextData;
		}
	};

	@Before
	public void setUp()
	{
		MockitoAnnotations.initMocks(this);
	}

	@Test
	public void testRenderComponent()
	{
		given(productReferencesComponentModel.getMaximumNumberProducts()).willReturn(Integer.valueOf(1));
		given(productReferencesComponentModel.getTitle()).willReturn(TITLE_VALUE);
		given(productReferencesComponentModel.getProductReferenceTypes()).willReturn(
				Arrays.asList(ProductReferenceTypeEnum.ACCESSORIES));
		given(productReferencesComponentModel.getItemtype()).willReturn(TEST_TYPE_CODE);

		requestContextData.setProduct(new ProductModel());
		given(
				productFacade.getProductReferencesForCode(Mockito.anyString(), Mockito.anyList(), Mockito.any(List.class),
						Mockito.<Integer> any())).willReturn(productReferenceDataList);
		given(request.getAttribute(COMPONENT)).willReturn(productReferencesComponentModel);

		final String viewName = productReferencesComponentController.handleGet(request, response, model);
		verify(model, Mockito.times(1)).addAttribute(COMPONENT, productReferencesComponentModel);
		verify(model, Mockito.times(1)).addAttribute(TITLE, TITLE_VALUE);
		verify(model, Mockito.times(1)).addAttribute(PRODUCT_REFERENCES, productReferenceDataList);
		Assert.assertEquals(TEST_TYPE_VIEW, viewName);
	}

	@Test
	public void testRenderComponentUid() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getAbstractCMSComponent(TEST_COMPONENT_UID)).willReturn(productReferencesComponentModel);
		given(productReferencesComponentModel.getMaximumNumberProducts()).willReturn(Integer.valueOf(1));
		given(productReferencesComponentModel.getTitle()).willReturn(TITLE_VALUE);
		given(productReferencesComponentModel.getProductReferenceTypes()).willReturn(
				Arrays.asList(ProductReferenceTypeEnum.ACCESSORIES));
		given(productReferencesComponentModel.getItemtype()).willReturn(TEST_TYPE_CODE);

		requestContextData.setProduct(new ProductModel());
		given(
				productFacade.getProductReferencesForCode(Mockito.anyString(), Mockito.anyList(), Mockito.any(List.class),
						Mockito.<Integer> any())).willReturn(productReferenceDataList);

		final String viewName = productReferencesComponentController.handleGet(request, response, model);
		verify(model, Mockito.times(1)).addAttribute(COMPONENT, productReferencesComponentModel);
		verify(model, Mockito.times(1)).addAttribute(TITLE, TITLE_VALUE);
		verify(model, Mockito.times(1)).addAttribute(PRODUCT_REFERENCES, productReferenceDataList);
		Assert.assertEquals(TEST_TYPE_VIEW, viewName);
	}


	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound()
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(null);
		given(request.getParameter(COMPONENT_UID)).willReturn(null);
		productReferencesComponentController.handleGet(request, response, model);
	}

	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound2() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(null);
		given(request.getParameter(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willReturn(null);
		productReferencesComponentController.handleGet(request, response, model);
	}

	@Test(expected = AbstractPageController.HttpNotFoundException.class)
	public void testRenderComponentNotFound3() throws Exception
	{
		given(request.getAttribute(COMPONENT_UID)).willReturn(TEST_COMPONENT_UID);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willReturn(null);
		given(cmsComponentService.getSimpleCMSComponent(TEST_COMPONENT_UID)).willThrow(new CMSItemNotFoundException(""));
		productReferencesComponentController.handleGet(request, response, model);
	}

}
