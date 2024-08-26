// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfProductAction, TmfProductActionType } from '../actions/tmf-product.action';
import { TmfProductMap } from '../tmf-product.state';

const initialState: TmfProductMap[] = [];

/**
 * Function to handle the transitions of TmfProductState
 * @param state The state of the TmfProductState
 * @param action Dispatched action of {@link TmfProductAction}
 * @returns list of {@link TmfProductMap} of {@link TmfProductState}
 */
export function tmfProductReducer(
  state = initialState,
  action: TmfProductAction
): TmfProductMap[] {
  switch (action.type) {
    case TmfProductActionType.LOAD_TMF_PRODUCT_SUCCESS: {
      if (
        !state.find(
          (tmfProductState: TmfProductMap) =>
            tmfProductState.id === action.payload.tmfProductId &&
            tmfProductState.baseSiteId === action.payload.baseSiteId
        )
      ) {
        state = state.concat({
          tmfProduct: action.payload.tmfProduct,
          id: action.payload.tmfProductId,
          baseSiteId: action.payload.baseSiteId
        });
      }
      return state;
    }
    case TmfProductActionType.CLEAR_TMF_PRODUCT: {
      return initialState;
    }
    case TmfProductActionType.LOAD_TMF_PRODUCT_FAIL: {
      return initialState;
    }
    case TmfProductActionType.LOAD_TMF_PRODUCTS_SUCCESS: {
      if (
        !state.find(
          (tmfProductState: TmfProductMap) =>
            tmfProductState.id === action.payload.tmfSubsciptionId &&
            tmfProductState.baseSiteId === action.payload.baseSiteId
        )
      ) {
        state = state.concat({
          tmfProduct: action.payload.tmfProduct,
          id: action.payload.tmfProductId,
          baseSiteId: action.payload.baseSiteId,
          tmfProducts: action.payload.tmfProducts
        });
      }
      return state;
    }
  }
  return state;
}
