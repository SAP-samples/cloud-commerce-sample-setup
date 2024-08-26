// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export const TMA_ADD_TO_CART_ACTION_FEATURE = 'Add-to-cart';
export const TMA_ADD_TO_CART_ACTION_DATA =
  '[Add-to-cart] Add to cart Action Data';

export interface TmaStateWithAddToCart {
  [TMA_ADD_TO_CART_ACTION_FEATURE]: TmaAddToCartActionsState;
}

export interface TmaAddToCartActionsState {
  addToCartPayload: any;
}
