/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.misc;

import static org.junit.Assert.*;
import static org.mockito.BDDMockito.*;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.AddToEntryGroupForm;
import de.hybris.platform.commercefacades.order.CartFacade;
import de.hybris.platform.commercefacades.order.converters.populator.GroupCartModificationListPopulator;
import de.hybris.platform.commercefacades.order.data.AddToCartParams;
import de.hybris.platform.commercefacades.order.data.CartModificationData;
import de.hybris.platform.commercefacades.order.data.OrderEntryData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commerceservices.order.CommerceCartModificationException;

import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.support.BindingAwareModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class AddToCartControllerTest
{
	private static final long QUANTITY_ADDED = 2L;
	private static final String CART_CODE = "123";
	private static final String PRODUCT_CODE = "10";

	@InjectMocks
	private final AddToCartController addToCartController = new AddToCartController();

	private Model model = new BindingAwareModelMap();

	@Mock
	private CartFacade cartFacade;

	@Mock
	private ProductFacade productFacade;

	@Mock
	private GroupCartModificationListPopulator groupCartModificationListPopulator;

	@Mock
	private AddToEntryGroupForm form;

	@Mock
	private BindingResult bindingResult;

	@Mock
	private RedirectAttributes redirectModel;

	@Mock
	private CartModificationData cartModification;

	@Mock
	private ProductData productData;

	@Mock
	private OrderEntryData orderEntryData;

	@Captor
	private ArgumentCaptor<List> listArgumentCaptor;

	@Before
	public void setUp()
	{
		given(form.getEntryGroupNumber()).willReturn(1);
		given(form.getProductCode()).willReturn(PRODUCT_CODE);
		given(bindingResult.hasErrors()).willReturn(false);
	}

	@Test
	public void shouldAddEntryGroupToCart() throws CommerceCartModificationException
	{
		given(cartFacade.addToCart(Mockito.any(AddToCartParams.class))).willReturn(cartModification);

		given(cartModification.getQuantityAdded()).willReturn(QUANTITY_ADDED);
		given(cartModification.getEntry()).willReturn(orderEntryData);
		given(cartModification.getCartCode()).willReturn(CART_CODE);
		given(productFacade.getProductForCodeAndOptions(PRODUCT_CODE, List.of(ProductOption.BASIC)))
				.willReturn(productData);


		final String redirectPage = addToCartController.addEntryGroupToCart(model, form, bindingResult, redirectModel);

		assertEquals(QUANTITY_ADDED, model.getAttribute("quantity"));
		assertEquals(orderEntryData, model.getAttribute("entry"));
		assertEquals(CART_CODE, model.getAttribute("cartCode"));
		assertEquals(productData, model.getAttribute("product"));

		assertEquals("redirect:/cart", redirectPage);
	}

	@Test
	public void shouldHandleExceptionWhileAddEntryGroupToCart() throws CommerceCartModificationException
	{
		final String testErrorMessage = "Test error message";
		given(cartFacade.addToCart(Mockito.any(AddToCartParams.class)))
				.willThrow(new CommerceCartModificationException(testErrorMessage));
		given(productFacade.getProductForCodeAndOptions(PRODUCT_CODE, List.of(ProductOption.BASIC)))
				.willReturn(productData);
		try (MockedStatic<GlobalMessages> globalMessagesMocked = Mockito.mockStatic(GlobalMessages.class))
		{
			final String redirectPage = addToCartController.addEntryGroupToCart(model, form, bindingResult, redirectModel);

			globalMessagesMocked.verify(
					() -> GlobalMessages.addFlashMessage(redirectModel, "accErrorMsgs", testErrorMessage, null),
					times(1));

			assertEquals("basket.error.occurred", model.getAttribute("errorMsg"));
			assertEquals(0L, model.getAttribute("quantity"));
			assertEquals(productData, model.getAttribute("product"));

			assertEquals("redirect:/cart", redirectPage);
		}

	}
}
