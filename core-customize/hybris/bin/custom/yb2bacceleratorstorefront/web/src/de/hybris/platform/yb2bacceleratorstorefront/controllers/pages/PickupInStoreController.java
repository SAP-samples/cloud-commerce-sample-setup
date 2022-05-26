/*
 * Copyright (c) 2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
package de.hybris.platform.yb2bacceleratorstorefront.controllers.pages;

import de.hybris.platform.acceleratorfacades.customerlocation.CustomerLocationFacade;
import de.hybris.platform.acceleratorservices.store.data.UserLocationData;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.pages.AbstractSearchPageController;
import de.hybris.platform.acceleratorstorefrontcommons.controllers.util.GlobalMessages;
import de.hybris.platform.acceleratorstorefrontcommons.forms.PickupInStoreForm;
import de.hybris.platform.commercefacades.order.CartFacade;
import de.hybris.platform.commercefacades.order.data.CartModificationData;
import de.hybris.platform.commercefacades.product.ProductFacade;
import de.hybris.platform.commercefacades.product.ProductOption;
import de.hybris.platform.commercefacades.product.data.ProductData;
import de.hybris.platform.commercefacades.storefinder.StoreFinderStockFacade;
import de.hybris.platform.commercefacades.storefinder.data.StoreFinderStockSearchPageData;
import de.hybris.platform.commercefacades.storelocator.data.PointOfServiceStockData;
import de.hybris.platform.commerceservices.order.CommerceCartModificationException;
import de.hybris.platform.commerceservices.order.CommerceCartModificationStatus;
import de.hybris.platform.commerceservices.store.data.GeoPoint;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.yb2bacceleratorstorefront.controllers.ControllerConstants;
import de.hybris.platform.yb2bacceleratorstorefront.security.cookie.CustomerLocationCookieGenerator;

import java.util.Arrays;
import java.util.Collections;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequestMapping("/store-pickup")
public class PickupInStoreController extends AbstractSearchPageController
{
	private static final String QUANTITY_REDUCED_NUMBER_OF_ITEMS_ADDED = "basket.information.quantity.reducedNumberOfItemsAdded.";
	private static final String TYPE_MISMATCH_ERROR_CODE = "typeMismatch";
	private static final String ERROR_MSG_TYPE = "errorMsg";
	private static final String QUANTITY_INVALID_BINDING_MESSAGE_KEY = "basket.error.quantity.invalid.binding";
	private static final String POINTOFSERVICE_DISPLAY_SEARCH_RESULTS_COUNT = "pointofservice.display.search.results.count";

	private static final Logger LOG = LoggerFactory.getLogger(PickupInStoreController.class);

	private static final String PRODUCT_CODE_PATH_VARIABLE_PATTERN = "/{productCode:.*}";
	private static final String GOOGLE_API_KEY_ID = "googleApiKey";
	private static final String GOOGLE_API_VERSION = "googleApiVersion";

	@Resource(name = "cartFacade")
	private CartFacade cartFacade;

	@Resource(name = "productVariantFacade")
	private ProductFacade productFacade;

	@Resource(name = "customerLocationFacade")
	private CustomerLocationFacade customerLocationFacade;

	@Resource(name = "storeFinderStockFacade")
	private StoreFinderStockFacade<PointOfServiceStockData, StoreFinderStockSearchPageData<PointOfServiceStockData>> storeFinderStockFacade;

	@Resource(name = "customerLocationCookieGenerator")
	private CustomerLocationCookieGenerator cookieGenerator;

	@Resource(name = "configurationService")
	private ConfigurationService configurationService;

	@ModelAttribute("googleApiVersion")
	public String getGoogleApiVersion()
	{
		return configurationService.getConfiguration().getString(GOOGLE_API_VERSION);
	}

	@ModelAttribute("googleApiKey")
	public String getGoogleApiKey(final HttpServletRequest request)
	{
		final String googleApiKey = getHostConfigService().getProperty(GOOGLE_API_KEY_ID, request.getServerName());
		if (StringUtils.isEmpty(googleApiKey))
		{
			LOG.warn("No Google API key found for server: {}", request.getServerName());
		}
		return googleApiKey;
	}

	@PostMapping(value = PRODUCT_CODE_PATH_VARIABLE_PATTERN + "/pointOfServices")
	public String getPointOfServiceForStorePickupSubmit(@PathVariable("productCode") final String productCode,
			@RequestParam(value = "locationQuery", required = false) final String locationQuery,
			@RequestParam(value = "latitude", required = false) final Double latitude,
			@RequestParam(value = "longitude", required = false) final Double longitude,
			@RequestParam(value = "page", defaultValue = "0") final int page,
			@RequestParam(value = "show", defaultValue = "Page") final AbstractSearchPageController.ShowMode showMode,
			@RequestParam(value = "sort", required = false) final String sortCode,
			@RequestParam(value = "cartPage", defaultValue = "Page") final Boolean cartPage,
			@RequestParam(value = "entryNumber", defaultValue = "0") final Long entryNumber,
			@RequestParam(value = "qty", defaultValue = "0") final Long qty, final HttpServletResponse response, final Model model)
	{
		GeoPoint geoPoint = null;
		if (longitude != null && latitude != null)
		{
			geoPoint = new GeoPoint();
			geoPoint.setLongitude(longitude.doubleValue());
			geoPoint.setLatitude(latitude.doubleValue());
		}

		model.addAttribute("qty", qty);

		return getPointOfServiceForStorePickup(productCode, locationQuery, geoPoint, page, showMode, sortCode,
				cartPage, entryNumber, model, RequestMethod.POST, response);
	}

	@GetMapping(value = PRODUCT_CODE_PATH_VARIABLE_PATTERN + "/pointOfServices")
	public String getPointOfServiceForStorePickupClick(@PathVariable("productCode") final String productCode,
			@RequestParam(value = "page", defaultValue = "0") final int page,
			@RequestParam(value = "show", defaultValue = "Page") final AbstractSearchPageController.ShowMode showMode,
			@RequestParam(value = "sort", required = false) final String sortCode,
			@RequestParam(value = "cartPage") final Boolean cartPage, @RequestParam(value = "entryNumber") final Long entryNumber,
			final HttpServletResponse response, final Model model)
	{
		final UserLocationData userLocationData = customerLocationFacade.getUserLocationData();
		String location = "";
		GeoPoint geoPoint = null;

		if (userLocationData != null)
		{
			location = userLocationData.getSearchTerm();
			geoPoint = userLocationData.getPoint();
		}

		return getPointOfServiceForStorePickup(productCode, location, geoPoint, page, showMode, sortCode,
				cartPage, entryNumber, model, RequestMethod.GET, response);
	}

	protected String getPointOfServiceForStorePickup(final String productCode, final String locationQuery, 
			final GeoPoint geoPoint, final int page, final AbstractSearchPageController.ShowMode showMode, final String sortCode,
			final Boolean cartPage, final Long entryNumber, final Model model, final RequestMethod requestMethod,
			final HttpServletResponse response)
	{
		final int pagination = getSiteConfigService().getInt(POINTOFSERVICE_DISPLAY_SEARCH_RESULTS_COUNT, 6);
		final ProductData productData = new ProductData();
		productData.setCode(productCode);

		final StoreFinderStockSearchPageData<PointOfServiceStockData> storeFinderStockSearchPageData;

		if (StringUtils.isNotBlank(locationQuery))
		{
			storeFinderStockSearchPageData = storeFinderStockFacade.productSearch(locationQuery, productData,
					createPageableData(page, pagination, sortCode, showMode));
			model.addAttribute("locationQuery", locationQuery.trim());
			if (RequestMethod.POST.equals(requestMethod)
					&& storeFinderStockSearchPageData.getPagination().getTotalNumberOfResults() > 0)
			{
				final UserLocationData userLocationData = new UserLocationData();

				if (geoPoint != null)
				{
					userLocationData.setPoint(geoPoint);
				}

				userLocationData.setSearchTerm(locationQuery);
				customerLocationFacade.setUserLocationData(userLocationData);
				cookieGenerator.addCookie(response, generatedUserLocationDataString(userLocationData));
			}
		}
		else if (geoPoint != null)
		{
			storeFinderStockSearchPageData = storeFinderStockFacade.productSearch(geoPoint, productData,
					createPageableData(page, pagination, sortCode, showMode));
			model.addAttribute("geoPoint", geoPoint);
			if (RequestMethod.POST.equals(requestMethod)
					&& storeFinderStockSearchPageData.getPagination().getTotalNumberOfResults() > 0)
			{
				final UserLocationData userLocationData = new UserLocationData();
				userLocationData.setPoint(geoPoint);
				customerLocationFacade.setUserLocationData(userLocationData);
				cookieGenerator.addCookie(response, generatedUserLocationDataString(userLocationData));
			}
		}
		else
		{
			storeFinderStockSearchPageData = emptyStoreFinderResult(productData);
		}

		populateModel(model, storeFinderStockSearchPageData, showMode);

		model.addAttribute("cartPage", cartPage);
		model.addAttribute("entryNumber", entryNumber);

		return ControllerConstants.Views.Fragments.Product.StorePickupSearchResults;
	}

	protected StoreFinderStockSearchPageData<PointOfServiceStockData> emptyStoreFinderResult(final ProductData productData)
	{
		final StoreFinderStockSearchPageData<PointOfServiceStockData> storeFinderStockSearchPageData;
		storeFinderStockSearchPageData = new StoreFinderStockSearchPageData<>();
		storeFinderStockSearchPageData.setProduct(productData);
		storeFinderStockSearchPageData.setResults(Collections.<PointOfServiceStockData> emptyList());
		storeFinderStockSearchPageData.setPagination(createEmptyPagination());

		return storeFinderStockSearchPageData;
	}

	protected String generatedUserLocationDataString(final UserLocationData userLocationData)
	{
		final StringBuilder builder = new StringBuilder();
		final GeoPoint geoPoint = userLocationData.getPoint();
		String latitudeAndLongitudeString = "";
		if (geoPoint != null)
		{
			latitudeAndLongitudeString = builder.append(geoPoint.getLatitude())
					.append(CustomerLocationCookieGenerator.LATITUDE_LONGITUDE_SEPARATOR).append(geoPoint.getLongitude()).toString();
		}

		builder.setLength(0);
		builder.append(userLocationData.getSearchTerm()).append(CustomerLocationCookieGenerator.LOCATION_SEPARATOR)
				.append(latitudeAndLongitudeString);

		return builder.toString();
	}

	@PostMapping(value = "/cart/add", produces = "application/json")
	public String addToCartPickup(@RequestParam("productCodePost") final String code,
			@RequestParam("storeNamePost") final String storeId, final Model model, @Valid final PickupInStoreForm form,
			final BindingResult bindingErrors)
	{
		if (bindingErrors.hasErrors())
		{
			return getViewWithBindingErrorMessages(model, bindingErrors);
		}

		final long qty = form.getHiddenPickupQty();

		if (qty <= 0)
		{
			model.addAttribute(ERROR_MSG_TYPE, "basket.error.quantity.invalid");
			return ControllerConstants.Views.Fragments.Cart.AddToCartPopup;
		}

		try
		{
			final CartModificationData cartModification = cartFacade.addToCart(code, qty, storeId);
			model.addAttribute("quantity", Long.valueOf(cartModification.getQuantityAdded()));
			model.addAttribute("entry", cartModification.getEntry());

			if (cartModification.getQuantityAdded() == 0L)
			{
				model.addAttribute(ERROR_MSG_TYPE, "basket.information.quantity.noItemsAdded." + cartModification.getStatusCode());
			}
			else if (cartModification.getQuantityAdded() < qty)
			{
				model.addAttribute(ERROR_MSG_TYPE, QUANTITY_REDUCED_NUMBER_OF_ITEMS_ADDED + cartModification.getStatusCode());
			}

			// Put in the cart again after it has been modified
			model.addAttribute("cartData", cartFacade.getSessionCart());
		}
		catch (final CommerceCartModificationException ex)
		{
			model.addAttribute(ERROR_MSG_TYPE, "basket.error.occurred");
			model.addAttribute("quantity", Long.valueOf(0L));
			LOG.warn("Couldn't add product of code " + code + " to cart.", ex);
		}

		final ProductData productData = productFacade.getProductForCodeAndOptions(code,
				Arrays.asList(ProductOption.BASIC, ProductOption.PRICE));
		model.addAttribute("product", productData);

		model.addAttribute("cartData", cartFacade.getSessionCart());

		return ControllerConstants.Views.Fragments.Cart.AddToCartPopup;
	}

	protected String getViewWithBindingErrorMessages(final Model model, final BindingResult bindingErrors)
	{
		for (final ObjectError error : bindingErrors.getAllErrors())
		{
			if (isTypeMismatchError(error))
			{
				model.addAttribute(ERROR_MSG_TYPE, QUANTITY_INVALID_BINDING_MESSAGE_KEY);
			}
			else
			{
				model.addAttribute(ERROR_MSG_TYPE, error.getDefaultMessage());
			}
		}
		return ControllerConstants.Views.Fragments.Cart.AddToCartPopup;
	}

	protected boolean isTypeMismatchError(final ObjectError error)
	{
		return TYPE_MISMATCH_ERROR_CODE.equals(error.getCode());
	}

	@PostMapping(value = "/cart/update", produces = "application/json")
	public String updateCartQuantities(@RequestParam("storeNamePost") final String storeId,
			@RequestParam("entryNumber") final long entryNumber, @RequestParam("hiddenPickupQty") final long quantity,
			final RedirectAttributes redirectModel) throws CommerceCartModificationException
	{
		final CartModificationData cartModificationData = cartFacade.updateCartEntry(entryNumber, storeId);

		if (entryNumber == cartModificationData.getEntry().getEntryNumber())
		{
			final CartModificationData cartModification = cartFacade.updateCartEntry(entryNumber, quantity);
			if (cartModification.getQuantity() == quantity)
			{
				// Success
				if (cartModification.getQuantity() == 0)
				{
					// Success in removing entry
					GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER, "basket.page.message.remove");
				}
				else
				{
					// Success in update quantity
					GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
							"basket.page.message.update.pickupinstoreitem");
				}
			}
			else
			{
				// Less than successful
				GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
						QUANTITY_REDUCED_NUMBER_OF_ITEMS_ADDED + cartModification.getStatusCode());
			}
		}
		else if (!CommerceCartModificationStatus.SUCCESS.equals(cartModificationData.getStatusCode()))
		{
			//When update pickupInStore happens to be same as existing entry with POS and SKU and that merged POS has lower stock
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					QUANTITY_REDUCED_NUMBER_OF_ITEMS_ADDED + cartModificationData.getStatusCode());
		}

		return REDIRECT_PREFIX + "/cart";
	}

	@RequestMapping(value = "/cart/update/delivery", method = RequestMethod.POST )
	public String updateToDelivery(@RequestParam("entryNumber") final long entryNumber, final RedirectAttributes redirectModel)
			throws CommerceCartModificationException
	{
		final CartModificationData cartModificationData = cartFacade.updateCartEntry(entryNumber, null);
		if (CommerceCartModificationStatus.SUCCESS.equals(cartModificationData.getStatusCode()))
		{
			// Success in update quantity
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.CONF_MESSAGES_HOLDER,
					"basket.page.message.update.pickupinstoreitem.toship");
		}
		else
		{
			// Less than successful
			GlobalMessages.addFlashMessage(redirectModel, GlobalMessages.ERROR_MESSAGES_HOLDER,
					QUANTITY_REDUCED_NUMBER_OF_ITEMS_ADDED + cartModificationData.getStatusCode());
		}

		return REDIRECT_PREFIX + "/cart";
	}

}
