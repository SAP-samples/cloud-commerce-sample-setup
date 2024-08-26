// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

/**
 * Product Order action types
 */
export enum TmaProductOrderActionType {
  LOAD_PRODUCT_ORDERS = '[TmaProductOrder] Load Product Orders',
  LOAD_PRODUCT_ORDERS_SUCCESS = '[TmaProductOrder] Load Product Orders Success',
  LOAD_PRODUCT_ORDERS_FAIL = '[TmaProductOrder] Load Product Orders Fail',
  CLEAR_TMA_PRODUCT_ORDER_DATA = '[TmaProductOrder] Clear Product Order Data',
  UPDATE_ORDER = '[Order] Update Order',
  UPDATE_ORDER_SUCCESS = '[Order] Update Order Success',
  UPDATE_ORDER_FAIL = '[Order] Update Order Fail'
}

/**
 * Action for load Product Order
 */
export class LoadProductOrders implements Action {
  readonly type = TmaProductOrderActionType.LOAD_PRODUCT_ORDERS;
  constructor(public payload: any) {
  }
}

/**
 * Load Product Order Success Action
 */
export class LoadProductOrdersSuccess implements Action {
  readonly type = TmaProductOrderActionType.LOAD_PRODUCT_ORDERS_SUCCESS;
  constructor(public payload: any) {
  }
}

/**
 * Load Product Order Fail Action
 */
export class LoadProductOrdersFail implements Action {
  readonly type = TmaProductOrderActionType.LOAD_PRODUCT_ORDERS_FAIL;
  constructor(public payload: any) {
  }
}

/**
 * Action for clearing Product Order data
 */
export class ClearTmaProductOrderData implements Action {
  readonly type = TmaProductOrderActionType.CLEAR_TMA_PRODUCT_ORDER_DATA;
}

export class UpdateOrder implements Action {
  readonly type = TmaProductOrderActionType.UPDATE_ORDER;
  constructor(public payload: any) {}
}

export class UpdateOrderSuccess implements Action {
  readonly type =
  TmaProductOrderActionType.UPDATE_ORDER_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateOrderFail implements Action {
  readonly type = TmaProductOrderActionType.UPDATE_ORDER_FAIL;
  constructor(public payload: any) {}
}

export type TmaProductOrderActions =
  LoadProductOrders
  | LoadProductOrdersSuccess
  | LoadProductOrdersFail
  | ClearTmaProductOrderData
  | UpdateOrder
  | UpdateOrderSuccess
  | UpdateOrderFail;
