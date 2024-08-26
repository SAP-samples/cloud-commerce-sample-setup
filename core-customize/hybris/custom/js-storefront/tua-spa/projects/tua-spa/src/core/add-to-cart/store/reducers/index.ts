// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap } from '@ngrx/store';
import { TmaAddToCartActionsState } from '../tma-add-to-cart-action.state';
import { InjectionToken, Provider } from '@angular/core';
import { addToCartPayloadReducer } from './tma-add-to-cart-payload.reducer';

export function getReducers(): ActionReducerMap<TmaAddToCartActionsState> {
  return {
    addToCartPayload: addToCartPayloadReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaAddToCartActionsState>> = new InjectionToken<ActionReducerMap<TmaAddToCartActionsState>>(
  'AddToCartReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};
