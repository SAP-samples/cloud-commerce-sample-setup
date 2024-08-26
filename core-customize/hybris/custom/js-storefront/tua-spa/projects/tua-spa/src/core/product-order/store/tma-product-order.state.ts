// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaPaginatedProductOrder } from '../../model';

/**
 * Product Order data constant
 */
export const TMA_PRODUCT_ORDER_DATA = '[TmaProductOrder] TmaProductOrderData';

/**
 * Product Order feature constant
 */
export const TMA_PRODUCT_ORDER_FEATURE = 'Product Order';

/**
 * State with Product Order
 */
export interface StateWithProductOrder {
  [TMA_PRODUCT_ORDER_FEATURE]: TmaProductOrderState;
}

/**
 * Product Order state
 */
export interface TmaProductOrderState {
  orders?: TmaPaginatedProductOrder;
}
