// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../model';
import { Tmf } from '../../tmf';
import { DeliveryMode } from '@spartacus/cart/base/root';

/**
 * Converter constant for converting {@link any} into {@link TmaPaginatedProductOrder}
 */
export const TMA_PAGINATED_ORDER_NORMALIZER = new InjectionToken<Converter<any, TmaPaginatedProductOrder>>('TmaPaginatedProductOrderNormalizer');

/**
 * Converter constant for converting {@link any} into {@link TmaProductOrder}
 */
export const TMA_PRODUCT_ORDER_NORMALIZER = new InjectionToken<Converter<any, any>>('TmaProductOrderNormalizer');

export const TMA_GEOGRAPHIC_ADDRESS_NORMALIZER = new InjectionToken<Converter<any, any>>('TmaGeoGraphicAddressNormalizer');

export const TMA_PAYMENT_DETAILS_NORMALIZER = new InjectionToken<Converter<any, any>>('TmaPaymentDetailsNormalizer');

export const TMA_DELIVERY_MODE_NORMALIZER = new InjectionToken<Converter<Tmf.TmfDeliveryModeRef, DeliveryMode>>('TmaDeliveryModeNormalizer');
