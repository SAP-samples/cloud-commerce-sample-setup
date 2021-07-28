/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.futurestock.FutureStockFacade;
import de.hybris.platform.acceleratorservices.data.RequestContextData;
import de.hybris.platform.acceleratorservices.storefront.util.PageTitleResolver;
import de.hybris.platform.acceleratorstorefrontcommons.breadcrumb.impl.ProductBreadcrumbBuilder;
import de.hybris.platform.acceleratorstorefrontcommons.forms.ReviewForm;
import de.hybris.platform.acceleratorstorefrontcommons.forms.validation.ReviewValidator;
import de.hybris.platform.acceleratorstorefrontcommons.variants.VariantSortStrategy;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.servicelayer.services.CMSPageService;
import de.hybris.platform.cms2.servicelayer.services.CMSPreviewService;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.url.UrlResolver;
import de.hybris.platform.core.Registry;
import de.hybris.platform.product.ProductService;
import de.hybris.platform.testframework.HybrisJUnit4ClassRunner;
import de.hybris.platform.testframework.HybrisJUnit4Test;

import java.io.UnsupportedEncodingException;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@UnitTest
@RunWith(HybrisJUnit4ClassRunner.class)
public class ProductPageControllerTest extends HybrisJUnit4Test
{
	private static final String PRODUCT_CODE = "ABC+ ^%$#@!*&%2B";

	@Mock
	private UrlResolver<ProductData> productDataUrlResolver;

	@Mock
	private ProductFacade productFacade;

	@Mock
	private ProductService productService;

	@Mock
	private ProductBreadcrumbBuilder productBreadcrumbBuilder;

	@Mock
	private CMSPageService cmsPageService;

	@Mock
	private VariantSortStrategy variantSortStrategy;

	@Mock
	private ReviewValidator reviewValidator;

	@Mock
	private FutureStockFacade futureStockFacade;

	@Mock
	private PageTitleResolver pageTitleResolver;

	@Mock
	private CMSPreviewService cmsPreviewService;

	@InjectMocks
	private ProductPageController controller;

	@Mock
	private Model model;

	@Mock
	private WebApplicationContext webApplicationContext;

	private final RequestContextData requestContextData = new RequestContextData();
	private final MockHttpServletRequest request = new MockHttpServletRequest();
	private final MockHttpServletResponse response = new MockHttpServletResponse();
	private final ProductData productData = new ProductData();

	@Before
	public void prepare()
	{
		MockitoAnnotations.initMocks(this);
		productData.setConfigurable(false);
		when(productFacade.getProductForCodeAndOptions(anyString(), any())).thenReturn(productData);

		request.getSession().getServletContext().setAttribute(WebApplicationContext.ROOT_WEB_APPLICATION_CONTEXT_ATTRIBUTE, webApplicationContext);
		when(webApplicationContext.getBean(any(), any(Class.class))).thenReturn(requestContextData);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_productDetail() throws CMSItemNotFoundException, UnsupportedEncodingException
	{
		controller.productDetail(PRODUCT_CODE, model, request, response);

		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_productOrderForm() throws CMSItemNotFoundException
	{
		controller.productOrderForm(PRODUCT_CODE, model, request, response);

		verify(productFacade, times(2)).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
		verify(pageTitleResolver).resolveProductPageTitle(PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_showZoomImages()
	{
		controller.showZoomImages(PRODUCT_CODE, null, model);

		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_showQuickView()
	{
		controller.showQuickView(PRODUCT_CODE, model, request);

		verify(productService).getProductForCode(PRODUCT_CODE);
		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_postReview() throws CMSItemNotFoundException
	{
		final ReviewForm reviewForm = new ReviewForm();
		final BindingResult bindingResult = mock(BindingResult.class);
		final RedirectAttributes redirectAttributes = mock(RedirectAttributes.class);
		controller.postReview(PRODUCT_CODE, reviewForm, bindingResult, model, request, redirectAttributes);

		verify(productFacade).getProductForCodeAndOptions(PRODUCT_CODE, null);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_reviewHtml()
	{
		controller.reviewHtml(PRODUCT_CODE, "1", model, request);

		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_writeReview() throws CMSItemNotFoundException
	{
		controller.writeReview(PRODUCT_CODE, model);

		verify(productFacade, times(2)).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_writeReview2() throws CMSItemNotFoundException
	{
		final ReviewForm reviewForm = new ReviewForm();
		final BindingResult bindingResult = mock(BindingResult.class);
		final RedirectAttributes redirectAttributes = mock(RedirectAttributes.class);
		controller.writeReview(PRODUCT_CODE, reviewForm, bindingResult, model, request, redirectAttributes);

		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_productFutureStock() throws CMSItemNotFoundException
	{
		Registry.getCurrentTenant().getConfig().setParameter("storefront.products.futurestock.enabled", "true");
		controller.productFutureStock(PRODUCT_CODE, model, request, response);

		verify(productFacade).getProductForCodeAndOptions(eq(PRODUCT_CODE), any());
	}
}
