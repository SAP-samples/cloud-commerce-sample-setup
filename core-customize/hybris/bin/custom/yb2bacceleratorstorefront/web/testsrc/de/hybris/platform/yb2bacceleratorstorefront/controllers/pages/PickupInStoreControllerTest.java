/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.customerlocation.CustomerLocationFacade;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorservices.store.data.UserLocationData;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController;
import de.hybris.platform.commercefacades.order.CartFacade;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commercefacades.storefinder.StoreFinderStockFacade;
import de.hybris.platform.commercefacades.storefinder.data.StoreFinderStockSearchPageData;
import de.hybris.platform.commercefacades.storelocator.data.PointOfServiceStockData;
import de.hybris.platform.commerceservices.search.pagedata.SearchPageData;
import de.hybris.platform.commerceservices.search.pagedata.PaginationData;
import de.hybris.platform.commerceservices.store.data.GeoPoint;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.yb2bacceleratorstorefront.security.cookie.CustomerLocationCookieGenerator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.ui.Model;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class PickupInStoreControllerTest
{
	private static final String PRODUCT_CODE = "ABC+ ^%$#@!*&%2B";
	private static final String LOCATION_QUERY = "MY_LOCATION";
	private static final Double LATITUDE = 5432D;
	private static final Double LONGITUDE = 1234D;
	private static final Integer PAGE_NUMBER = 1001;
	private static final AbstractSearchPageController.ShowMode SHOW_MODE = AbstractSearchPageController.ShowMode.All;
	private static final String SORT_CODE = "MY_SORT_CODE";
	private static final Boolean CART_PAGE = false;
	private static final Long ENTRY_NUMBER = 66L;
	private static final Long QUANTITY = 123L;

	@Mock
	private CartFacade cartFacade;

	@Mock
	private ProductFacade productFacade;

	@Mock
	private CustomerLocationFacade customerLocationFacade;

	@Mock
	private StoreFinderStockFacade<PointOfServiceStockData, StoreFinderStockSearchPageData<PointOfServiceStockData>> storeFinderStockFacade;

	@Mock
	private CustomerLocationCookieGenerator cookieGenerator;

	@Mock
	private ConfigurationService configurationService;

	@Mock
	private SiteConfigService siteConfigService;

	@InjectMocks
	private PickupInStoreController controller;

	@Mock
	private Model model;
	@Captor
	private ArgumentCaptor<ProductData> productDataCaptor;
	@Captor
	private ArgumentCaptor<SearchPageData> searchPageDataCaptor;

	private final MockHttpServletRequest request = new MockHttpServletRequest();
	private final MockHttpServletResponse response = new MockHttpServletResponse();
	private final ProductData productData = new ProductData();
	private final StoreFinderStockSearchPageData<PointOfServiceStockData> storeFinderStockSearchPageData = new StoreFinderStockSearchPageData<>();
	private final UserLocationData userLocationData = new UserLocationData();


	@Before
	public void prepare()
	{
		when(storeFinderStockFacade.productSearch(eq(LOCATION_QUERY), any(), any())).thenReturn(storeFinderStockSearchPageData);
		when(storeFinderStockFacade.productSearch(any(GeoPoint.class), any(), any())).thenReturn(storeFinderStockSearchPageData);
		when(customerLocationFacade.getUserLocationData()).thenReturn(userLocationData);
		storeFinderStockSearchPageData.setPagination(new PaginationData());

		userLocationData.setSearchTerm(LOCATION_QUERY);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupSubmit_withLocationQuery()
	{
		controller.getPointOfServiceForStorePickupSubmit(PRODUCT_CODE, LOCATION_QUERY, null, null, PAGE_NUMBER,
			SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, QUANTITY, response, model);

		verify(storeFinderStockFacade).productSearch(eq(LOCATION_QUERY), productDataCaptor.capture(), any());
		assertThat(productDataCaptor.getValue()).hasFieldOrPropertyWithValue("code", PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupSubmit_withGeoPoint()
	{
		controller.getPointOfServiceForStorePickupSubmit(PRODUCT_CODE, null, LATITUDE, LONGITUDE, PAGE_NUMBER,
			SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, QUANTITY, response, model);

		verify(storeFinderStockFacade).productSearch(any(GeoPoint.class), productDataCaptor.capture(), any());
		assertThat(productDataCaptor.getValue()).hasFieldOrPropertyWithValue("code", PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupSubmit_noLocation_noGeoPoint()
	{
		controller.getPointOfServiceForStorePickupSubmit(PRODUCT_CODE, null, null, null, PAGE_NUMBER,
			SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, QUANTITY, response, model);

		verifyNoMoreInteractions(storeFinderStockFacade);
		verify(model).addAttribute(eq("searchPageData"), searchPageDataCaptor.capture());

		assertThat(searchPageDataCaptor.getValue())
			.hasFieldOrProperty("product")
			.extracting("product")
			.extracting("code")
			.containsExactly(PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupClick_withLocationData_withQuery()
	{
		controller.getPointOfServiceForStorePickupClick(PRODUCT_CODE, PAGE_NUMBER, SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, response, model);

		verify(storeFinderStockFacade).productSearch(eq(LOCATION_QUERY), productDataCaptor.capture(), any());
		assertThat(productDataCaptor.getValue()).hasFieldOrPropertyWithValue("code", PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupClick_withLocationData_withGeoPoint()
	{
		userLocationData.setSearchTerm("");
		userLocationData.setPoint(new GeoPoint());
		controller.getPointOfServiceForStorePickupClick(PRODUCT_CODE, PAGE_NUMBER, SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, response, model);

		verify(storeFinderStockFacade).productSearch(any(GeoPoint.class), productDataCaptor.capture(), any());
		assertThat(productDataCaptor.getValue()).hasFieldOrPropertyWithValue("code", PRODUCT_CODE);
	}

	@Test
	public void testProductCodeIsCorrectlyDecodedAndUsed_getPointOfServiceForStorePickupClick_noLocationData()
	{
		when(customerLocationFacade.getUserLocationData()).thenReturn(null);
		controller.getPointOfServiceForStorePickupClick(PRODUCT_CODE, PAGE_NUMBER, SHOW_MODE, SORT_CODE, CART_PAGE, ENTRY_NUMBER, response, model);

		verifyNoMoreInteractions(storeFinderStockFacade);
		verify(model).addAttribute(eq("searchPageData"), searchPageDataCaptor.capture());

		assertThat(searchPageDataCaptor.getValue())
			.hasFieldOrProperty("product")
			.extracting("product")
			.extracting("code")
			.containsExactly(PRODUCT_CODE);
	}
}
