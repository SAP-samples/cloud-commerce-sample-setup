// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateWithProductOrder, TMA_PRODUCT_ORDER_FEATURE, TmaProductOrderState } from '../tma-product-order.state';
import { TmaPaginatedProductOrder } from '../../../model';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

/**
 * Returns the feature state for product order.
 *
 * @return The {@link TmaProductOrderState}
 */
export const getProductOrderFeatureState: MemoizedSelector<StateWithProductOrder,
  TmaProductOrderState> = createFeatureSelector<TmaProductOrderState>(TMA_PRODUCT_ORDER_FEATURE);


/**
 * Returns the paginated product order.
 *
 * @return {@link PaginatedTmaProductOrder}
 */
export const getPaginatedProductOrders: MemoizedSelector<StateWithProductOrder,
  TmaPaginatedProductOrder> = createSelector(getProductOrderFeatureState, (state: TmaProductOrderState) => state.orders);
