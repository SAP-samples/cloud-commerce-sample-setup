// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { TMA_ADD_TO_CART_ACTION_DATA } from '../tma-add-to-cart-action.state';

export const ADD_TO_CART_PAYLOAD = '[Add-to-cart] Tma Add To Cart Payload'
export const CLEAR_ADD_TO_CART_PAYLOAD = '[Add-to-cart] Clear Tma Add To Cart Payload'

export class AddToCartPayload extends StateUtils.LoaderLoadAction {
  readonly type = ADD_TO_CART_PAYLOAD;
  constructor(
    public payload: any
  ) {
    super(TMA_ADD_TO_CART_ACTION_DATA);
  }
}

export class ClearAddToCartPayload extends StateUtils.LoaderLoadAction {
  readonly type = CLEAR_ADD_TO_CART_PAYLOAD;
  constructor() {
    super(ADD_TO_CART_PAYLOAD);
  }
}

export type TmaAddToCartPayloadActionType =
  | AddToCartPayload
  | ClearAddToCartPayload;
