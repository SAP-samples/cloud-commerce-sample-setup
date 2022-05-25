/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorservices.config.SiteConfigService;
import de.hybris.platform.acceleratorstorefrontcommons.constants.WebConstants;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessage;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.UpdateQuantityForm;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.commercefacades.order.CartFacade;
import de.hybris.platform.commercefacades.order.data.CartData;
import de.hybris.platform.commercefacades.order.data.CartModificationData;
import de.hybris.platform.commercefacades.order.data.CartRestorationData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.order.CommerceCartModificationException;
import de.hybris.platform.commerceservices.order.CommerceCartModificationStatus;
import de.hybris.platform.servicelayer.session.SessionService;

import javax.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.support.BindingAwareModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CartPageControllerTest
{
	@InjectMocks
	private CartPageController controller;

	private final Model page = spy(new BindingAwareModelMap());

	private final Long FORM_QUANTITY = Long.valueOf(5);

	private final long ENTRY_NUMBER = 0;

	private final String PRODUCT_NAME = "product1";

	private final String PRODUCT_CODE = "product_code";

	@Mock
	private SiteConfigService service;

	@Mock
	private SessionService sessionService;

	@Mock
	private CartRestorationData restorationData;

	@Mock
	private Model model;

	@Mock
	private UpdateQuantityForm updateQuantityForm;

	@Mock
	private BindingResult bindingResult;

	@Mock
	private HttpServletRequest httpServletRequest;

	private RedirectAttributes redirectAttributes;

	@Mock
	private CartFacade cartFacade;

	@Mock
	protected ProductFacade productFacade;

	@Mock
	private CartModificationData cartModificationData;

	@Mock
	private OrderEntryData orderEntry;

	@Mock
	private ProductData product;

	@Mock
	private CartData cart;


	@Before
	public void prepare()
	{
		restorationData = mock(CartRestorationData.class);
		redirectAttributes = new RedirectAttributesModelMap();
	}

	@Test
	public void testTrueStringProperty()
	{
		given(service.getBoolean(CartPageController.SHOW_CHECKOUT_STRATEGY_OPTIONS, false)).willReturn(Boolean.TRUE);

		Assert.assertTrue(controller.isCheckoutStrategyVisible());
	}

	@Test
	public void testSetupCartPageNullRestoration()
	{
		given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(null);
		controller.setupCartPageRestorationData(page);
		Assert.assertTrue(page.containsAttribute("showModifications"));
	}

	@Test
	public void testSetupCartPageErrorRestoration()
	{
		given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(restorationData);
		given(sessionService.getAttribute(WebConstants.CART_RESTORATION_ERROR_STATUS)).willReturn(
				WebConstants.CART_RESTORATION_ERROR_STATUS);
		controller.setupCartPageRestorationData(page);

		Assert.assertTrue(page.containsAttribute("restorationErrorMsg"));
	}

	@Test
	public void testSetupCartPageSuccessfulRestoration()
	{
		given(sessionService.getAttribute(WebConstants.CART_RESTORATION)).willReturn(restorationData);
		controller.setupCartPageRestorationData(page);

		Assert.assertTrue(page.containsAttribute("restorationData"));
		Assert.assertTrue(page.containsAttribute("showModifications"));
	}

	@Test
	public void testUpdateQuantityExceedsLimit() throws CMSItemNotFoundException, CommerceCartModificationException
	{
		mockUpdateQuantityWithGivenStatus(CommerceCartModificationStatus.MAX_BUNDLE_SELECTION_CRITERIA_LIMIT_EXCEEDED);

		controller.updateCartQuantities(ENTRY_NUMBER, model, updateQuantityForm, bindingResult, httpServletRequest, redirectAttributes);

		Assert.assertTrue(containsMessage(redirectAttributes, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.page.message.update.reducedNumberOfItemsAdded.limitExceeded"));
	}

	@Test
	public void testGetProductVariantMatrix()
	{

		controller.getProductVariantMatrix(PRODUCT_CODE, "true", model);
		verify(productFacade).getProductForCodeAndOptions(anyString(), eq(Arrays.asList(ProductOption.BASIC, ProductOption.CATEGORIES, ProductOption.VARIANT_MATRIX_BASE,
				ProductOption.VARIANT_MATRIX_PRICE, ProductOption.VARIANT_MATRIX_MEDIA, ProductOption.VARIANT_MATRIX_STOCK,
				ProductOption.VARIANT_MATRIX_URL, ProductOption.VARIANT_FIRST_VARIANT,
				ProductOption.URL, ProductOption.PRICE, ProductOption.SUMMARY, ProductOption.DESCRIPTION, ProductOption.GALLERY,
				ProductOption.REVIEW, ProductOption.PROMOTIONS, ProductOption.CLASSIFICATION,
				ProductOption.VARIANT_FULL, ProductOption.STOCK, ProductOption.VOLUME_PRICES, ProductOption.PRICE_RANGE,
				ProductOption.DELIVERY_MODE_AVAILABILITY)));
	}

	@Test
	public void testUpdateQuantityLowStock() throws CMSItemNotFoundException, CommerceCartModificationException
	{
		mockUpdateQuantityWithGivenStatus(CommerceCartModificationStatus.LOW_STOCK);

		controller
				.updateCartQuantities(ENTRY_NUMBER, model, updateQuantityForm, bindingResult, httpServletRequest, redirectAttributes);

		Assert.assertTrue(containsMessage(redirectAttributes, GlobalMessages.ERROR_MESSAGES_HOLDER, "basket.page.message.update.reducedNumberOfItemsAdded.lowStock"));
	}

	private void mockUpdateQuantityWithGivenStatus(final String modificationStatus) throws CommerceCartModificationException
	{
		given(Boolean.valueOf(bindingResult.hasErrors())).willReturn(Boolean.FALSE);
		given(cartFacade.hasEntries()).willReturn(Boolean.TRUE);
		given(cartFacade.getSessionCart()).willReturn(cart);
		given(updateQuantityForm.getQuantity()).willReturn(FORM_QUANTITY);
		given(cartFacade.updateCartEntry(ENTRY_NUMBER, FORM_QUANTITY.longValue())).willReturn(cartModificationData);
		given(cartModificationData.getQuantity()).willReturn(Long.valueOf(2));
		given(cartModificationData.getStatusCode()).willReturn(modificationStatus);
		given(cartModificationData.getEntry()).willReturn(orderEntry);
		given(orderEntry.getProduct()).willReturn(product);
		given(product.getName()).willReturn(PRODUCT_NAME);
		given(product.getUrl()).willReturn("testUrl");
		given(httpServletRequest.getRequestURL()).willReturn(new StringBuffer("https://"));
	}

	private boolean containsMessage(final RedirectAttributes model, final String messageHolder, final String messageKey)
	{
		final Map<String, ?> flashModelMap = model.getFlashAttributes();
		if (flashModelMap.containsKey(messageHolder))
		{
			final List<GlobalMessage> messages = new ArrayList<>((List<GlobalMessage>) flashModelMap.get(messageHolder));
			return messages.stream().filter(GlobalMessage -> GlobalMessage.getCode().equals(messageKey)).findFirst().isPresent();
		}
		else
		{
			return false;
		}
	}
}
