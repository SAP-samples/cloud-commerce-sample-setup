// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import {
  TMA_ADD_TO_CART_ACTION_FEATURE,
  TmaAddToCartActionsState,
  TmaStateWithAddToCart
} from '../tma-add-to-cart-action.state';

export const getTmaAddToCartActionFeatureState: MemoizedSelector<
  TmaStateWithAddToCart,
  TmaAddToCartActionsState
> = createFeatureSelector<TmaAddToCartActionsState>(
  TMA_ADD_TO_CART_ACTION_FEATURE
);

export const getAddToCartPayload: MemoizedSelector<
  TmaStateWithAddToCart,
  any
> = createSelector(
  getTmaAddToCartActionFeatureState,
  (state: TmaAddToCartActionsState) => state.addToCartPayload
);
