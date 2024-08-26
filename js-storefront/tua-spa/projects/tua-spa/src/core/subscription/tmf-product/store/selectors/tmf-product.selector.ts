// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { TmaStateWithTmfProduct, TMF_PRODUCT_FEATURE, TmfProductMap, TmfProductState } from '../tmf-product.state';
import { TmfProduct } from '../../../../model';

export const getTmfProductFeatureState: MemoizedSelector<
  TmaStateWithTmfProduct,
  TmfProductState
> = createFeatureSelector<TmfProductState>(TMF_PRODUCT_FEATURE);

export const getTmfProductDetails: MemoizedSelector<
  TmaStateWithTmfProduct,
  TmfProductMap[]
> = createSelector(
  getTmfProductFeatureState,
  (state: TmfProductState) => state.tmfProductMap
);

export const getTmfProduct: MemoizedSelectorWithProps<
  TmaStateWithTmfProduct,
  any,
  TmfProduct
> = createSelector(
  getTmfProductDetails,
  (state: TmfProductMap[], props: any) => {
    const tmfProduct: TmfProductMap = state
      ? state.find(
          (sp: TmfProductMap) =>
            sp.id === props.tmfProductId &&
            sp.baseSiteId === props.baseSiteId
        )
      : undefined;
    return tmfProduct ? tmfProduct.tmfProduct : undefined;
  }
);

export const getTmfProductMap: MemoizedSelectorWithProps<
  TmaStateWithTmfProduct,
  any,
  TmfProductMap
> = createSelector(
  getTmfProductDetails,
  (state: TmfProductMap[], props: any) => {
    const tmfProductMap: TmfProductMap = state
      ? state.find(
          (productMap: TmfProductMap) =>
          productMap.id === props.tmfProductId &&
          productMap.baseSiteId === props.baseSiteId
        )
      : undefined;
    return tmfProductMap ? tmfProductMap : undefined;
  }
);
