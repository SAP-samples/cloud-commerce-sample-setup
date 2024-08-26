/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Action } from '@ngrx/store';
import { Cart } from '@spartacus/cart/base/root';
import { StateUtils } from '@spartacus/core';
import { MULTI_CART_DATA } from '@spartacus/cart/base/core';

export const CREATE_CART = '[Cart] Tma Create Cart';
export const CREATE_CART_FAIL = '[Cart] Tma Create Cart Fail';
export const CREATE_CART_SUCCESS = '[Cart] Tma Create Cart Success';

export const LOAD_CART = '[Cart] Tma Load Cart';
export const LOAD_CART_FAIL = '[Cart] Tma Load Cart Fail';
export const LOAD_CART_SUCCESS = '[Cart] Tma Load Cart Success';

export const MERGE_CART = '[Cart] Tma Merge Cart';


interface CreateCartPayload {
  userId: string;
  tempCartId: string;
  extraData?: {
    active?: boolean;
  };
  oldCartId?: string;
  toMergeCartGuid?: string;
}

export class CreateCart extends StateUtils.EntityLoadAction {
  readonly type = CREATE_CART;
  constructor(public payload: CreateCartPayload) {
    super(MULTI_CART_DATA, payload.tempCartId);
  }
}

interface CreateCartFailPayload extends CreateCartPayload {
  error: any;
}

export class CreateCartFail extends StateUtils.EntityFailAction {
  readonly type = CREATE_CART_FAIL;
  constructor(public payload: CreateCartFailPayload) {
    super(MULTI_CART_DATA, payload.tempCartId);
  }
}

interface CreateCartSuccessPayload extends CreateCartPayload {
  cart: Cart;
  cartId: string;
}

export class CreateCartSuccess extends StateUtils.EntitySuccessAction {
  readonly type = CREATE_CART_SUCCESS;
  constructor(public payload: CreateCartSuccessPayload) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

interface LoadCartPayload {
  userId: string;
  cartId: string;
  baseSiteId?: string;
  extraData?: {
    active?: boolean;
  };
}

export class LoadCart extends StateUtils.EntityLoadAction {
  readonly type = LOAD_CART;
  constructor(public payload: LoadCartPayload) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

interface LoadCartFailPayload extends LoadCartPayload {
  error: any;
}

export class LoadCartFail extends StateUtils.EntityFailAction {
  readonly type = LOAD_CART_FAIL;
  constructor(public payload: LoadCartFailPayload) {
    super(MULTI_CART_DATA, payload.cartId, payload.error);
  }
}

interface LoadCartSuccessPayload extends LoadCartPayload {
  cart: Cart;
}

export class LoadCartSuccess extends StateUtils.EntitySuccessAction {
  readonly type = LOAD_CART_SUCCESS;
  constructor(public payload: LoadCartSuccessPayload) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

interface MergeCartPayload {
  cartId: string;
  userId: string;
  extraData?: { active?: boolean };
  tempCartId: string;
}

export class MergeCart implements Action {
  readonly type = MERGE_CART;
  constructor(public payload: MergeCartPayload) {}
}


export type TmaCartAction =
  | CreateCart
  | CreateCartFail
  | CreateCartSuccess
  | LoadCart
  | LoadCartFail
  | LoadCartSuccess
  | MergeCart;
