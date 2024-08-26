// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { TmaProductOrderState } from '../tma-product-order.state';
import { productOrderReducer } from './product-order-approval.reducer';

export function getReducers(): ActionReducerMap<TmaProductOrderState> {
  return {
    orders: productOrderReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaProductOrderState>> = new InjectionToken<ActionReducerMap<TmaProductOrderState>>(
  'TmaProductOrderReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};
