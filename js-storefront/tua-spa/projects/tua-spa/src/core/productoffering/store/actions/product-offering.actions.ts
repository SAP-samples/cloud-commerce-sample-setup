// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum ProductOfferingActionTypes {
  LOAD_PRODUCT_OFFERING = '[Product-offering] Load Product Offering',
  LOAD_PRODUCT_OFFERING_SUCCESS = '[Product-offering] Load Product Offering Success',
  LOAD_PRODUCT_OFFERING_FAIL = '[Product-offering] Load Product Offering Fail',
  CLEAR_PRODUCT_OFFERING = '[Product-offering] Clear Load Product Offering',
}

export class LoadProductOffering implements Action {
  readonly type = ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING;
  constructor(public payload: any) {}
}

export class LoadProductOfferingSuccess implements Action {
  readonly type = ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadProductOfferingFail implements Action {
  readonly type = ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING_FAIL;
  constructor(public payload: any) {}
}

export class ClearProductOfferingState implements Action {
  readonly type = ProductOfferingActionTypes.CLEAR_PRODUCT_OFFERING;
  constructor() {
  }
}

export type ProductOfferingActions =
  | LoadProductOffering
  | LoadProductOfferingSuccess
  | LoadProductOfferingFail
  | ClearProductOfferingState;
