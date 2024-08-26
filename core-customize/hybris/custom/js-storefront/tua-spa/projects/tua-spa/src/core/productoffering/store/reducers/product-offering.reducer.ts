// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ProductOfferingActions, ProductOfferingActionTypes } from '../actions/product-offering.actions';
import { ProductOfferingMap } from '../product-offering-state';

export const productOfferingInitialState: ProductOfferingMap[] = [];

export function productOfferingReducer(
  state = productOfferingInitialState,
  action: ProductOfferingActions
): ProductOfferingMap[] {
  switch (action.type) {
    case ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING_SUCCESS: {
      if (
        !state.find(
          (productOfferingState: ProductOfferingMap) =>
            productOfferingState.processType === action.payload.processType &&
            productOfferingState.productOffering.code ===
              action.payload.productOffering.id
        )
      ) {
        state = state.concat({
          processType: action.payload.processType,
          productOffering: action.payload.productOffering
        });
      }
      return state;
    }
    case ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING_FAIL:
      case ProductOfferingActionTypes.CLEAR_PRODUCT_OFFERING: {
        state = productOfferingInitialState;
        return state;
    }
    default: {
      return state;
    }
  }
}
