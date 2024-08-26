// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaAddToCartPayloadActionType } from '../actions/tma-add-to-cart-payload.action';
import { TmaAddToCartActions } from '../actions';

const initialAddToCartPayloadState: any = undefined;
export function addToCartPayloadReducer(
  state = initialAddToCartPayloadState,
  action: TmaAddToCartPayloadActionType
): any {
  switch (action.type) {
    case TmaAddToCartActions.ADD_TO_CART_PAYLOAD: {
      if (action.payload) {
        state = action.payload;
      }
      return state;
    }
    case TmaAddToCartActions.CLEAR_ADD_TO_CART_PAYLOAD: {
      return initialAddToCartPayloadState;
    }
  }
  return state;
}
