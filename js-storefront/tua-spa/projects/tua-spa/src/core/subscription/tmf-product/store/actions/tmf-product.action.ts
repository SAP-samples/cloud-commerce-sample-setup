// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum TmfProductActionType {
  LOAD_TMF_PRODUCT = '[Tmf-Product] Load Tmf Product',
  LOAD_TMF_PRODUCT_SUCCESS = '[Tmf-Product] Load Tmf Product Success',
  LOAD_TMF_PRODUCTS = '[Tmf-Product] Load List of Tmf Product',
  LOAD_TMF_PRODUCTS_SUCCESS = '[Tmf-Product] Load List of Tmf Product Success',
  LOAD_TMF_PRODUCT_FAIL = '[Tmf-Product] Load Tmf Product Fail',
  CLEAR_TMF_PRODUCT = '[Tmf-Product] Clear Tmf Product',
}
export class LoadTmfProduct implements Action {
  readonly type = TmfProductActionType.LOAD_TMF_PRODUCT;
  constructor(public payload: any) {}
}

export class LoadTmfProductSuccess implements Action {
  readonly type = TmfProductActionType.LOAD_TMF_PRODUCT_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadTmfProductFail implements Action {
  readonly type = TmfProductActionType.LOAD_TMF_PRODUCT_FAIL;
  constructor(public payload: any) {}
}

export class LoadTmfProducts implements Action {
  readonly type = TmfProductActionType.LOAD_TMF_PRODUCTS;
  constructor(public payload: any) {}
}

export class LoadTmfProductsSuccess implements Action {
  readonly type = TmfProductActionType.LOAD_TMF_PRODUCTS_SUCCESS;
  constructor(public payload: any) {}
}

export class ClearTmfProduct implements Action {
  readonly type = TmfProductActionType.CLEAR_TMF_PRODUCT;
  constructor() {
  }
}

export type TmfProductAction =
  | LoadTmfProduct
  | LoadTmfProductSuccess
  | LoadTmfProductFail
  | LoadTmfProducts
  | LoadTmfProductsSuccess
  | ClearTmfProduct;
