// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { TmaProduct } from '../../../model';
import {
  PRODUCT_OFFERING_FEATURE,
  ProductOfferingMap,
  ProductOfferingState,
  StateWithProductOffering
} from '../product-offering-state';

export const getProductOfferingFeatureState: MemoizedSelector<
  StateWithProductOffering,
  ProductOfferingState
> = createFeatureSelector<ProductOfferingState>(PRODUCT_OFFERING_FEATURE);

export const getProductOfferingMap: MemoizedSelector<
  StateWithProductOffering,
  ProductOfferingMap[]
> = createSelector(
  getProductOfferingFeatureState,
  (state: ProductOfferingState) => state.productOfferingMap
);

export const getProductOffering: MemoizedSelectorWithProps<
  StateWithProductOffering,
  any,
  TmaProduct
> = createSelector(
  getProductOfferingMap,
  (state: ProductOfferingMap[], props) => {
    const productofferingMap = state
      ? state.find(
          (productOfferingMap: ProductOfferingMap) =>
            productOfferingMap.processType === props.processType &&
            productOfferingMap.productOffering?.code === props.productOfferingId
        )
      : undefined;
    if (!!productofferingMap) {
      return productofferingMap.productOffering;
    }
    return undefined;
  }
);
