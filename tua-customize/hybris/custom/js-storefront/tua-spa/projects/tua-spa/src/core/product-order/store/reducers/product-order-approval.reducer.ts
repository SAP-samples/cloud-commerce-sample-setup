// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaPaginatedProductOrder, TmaProductOrder } from '../../../model';
import { TmaProductOrderActionType } from '../actions/tma-product-order.action';
import { TmaProductOrderAction } from '../actions';

export const paginatedProductOrderInitialState: TmaPaginatedProductOrder = { orders: [] as TmaProductOrder[], totalCount: 0 };

/**
 * Reducer for product order information related actions
 *
 * @param state - The current state of the store
 * @param action - The action executed
 * @return List of {@link TmaProductOrder}
 */
export function productOrderReducer(
  state = paginatedProductOrderInitialState,
  action: TmaProductOrderAction.TmaProductOrderActions
): TmaPaginatedProductOrder {

  switch (action.type) {
    case TmaProductOrderActionType.LOAD_PRODUCT_ORDERS_SUCCESS: {
      return action.payload;
    }

    case TmaProductOrderActionType.LOAD_PRODUCT_ORDERS_FAIL:
    case TmaProductOrderActionType.CLEAR_TMA_PRODUCT_ORDER_DATA: {
      return paginatedProductOrderInitialState;
    }

    case TmaProductOrderActionType.UPDATE_ORDER_SUCCESS: {
      return {
        orders: state.orders.map((productOrder: TmaProductOrder) =>
          productOrder.id === action.payload.productOrder.id
            ? { ...action.payload.productOrder }
            : productOrder
        ),
        totalCount: state.totalCount
      };
    }
  }

  return state;
}
