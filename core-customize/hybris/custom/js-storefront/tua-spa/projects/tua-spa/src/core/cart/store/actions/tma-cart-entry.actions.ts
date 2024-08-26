// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { MULTI_CART_DATA } from '@spartacus/cart/base/core';
import { StateUtils } from '@spartacus/core';

export enum TmaCartEntryActionTypes {
  ADD_ENTRY = '[Cart-entry] Tma Add Entry',
  ADD_CART_ENTRY = '[Cart-entry] Add Cart Entry',
  ADD_CART_ENTRY_SUCCESS = '[Cart-entry] Add Cart Entry Success',
  ADD_CART_ENTRY_FAIL = '[Cart-entry] Add Cart Entry Fail',
  UPDATE_CART_ENTRY = '[Cart-entry] Update Cart Entry',
  UPDATE_ENTRY = '[Cart-entry] Tma Update Entry',
  UPDATE_CART_ENTRY_SUCCESS = '[Cart-entry] Update Cart Entry Success',
  UPDATE_CART_ENTRY_FAIL = '[Cart-entry] Update Cart Entry Fail',
  LOAD_CART = '[Cart] Load Cart'
}

export class AddEntry extends StateUtils.EntityProcessesIncrementAction {
  readonly type = TmaCartEntryActionTypes.ADD_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

/**
 * @deprecated since 2.1. Use instead AddEntry
 */
export class AddCartEntry extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

/**
 * @deprecated since 2.1
 */
export class AddCartEntrySuccess extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

/**
 * @deprecated since 2.1
 */
export class AddCartEntryFail extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.ADD_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

export class UpdateEntry extends StateUtils.EntityProcessesIncrementAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA, payload.cartId);
  }
}

/**
 * @deprecated since 2.1. Use instead UpdateEntry
 */
export class UpdateCartEntry extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}


export class LoadCart extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.LOAD_CART;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

/**
 * @deprecated since 2.1
 */
export class UpdateCartEntrySuccess extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_SUCCESS;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

/**
 * @deprecated since 2.1
 */
export class UpdateCartEntryFail extends StateUtils.LoaderLoadAction {
  readonly type = TmaCartEntryActionTypes.UPDATE_CART_ENTRY_FAIL;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}

export type TmaCartActionType =
  | AddEntry
  | AddCartEntry
  | AddCartEntrySuccess
  | AddCartEntryFail
  | UpdateEntry
  | UpdateCartEntry
  | UpdateCartEntrySuccess
  | UpdateCartEntryFail;
