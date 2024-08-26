// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { ProductOfferingState } from '../product-offering-state';
import { productOfferingReducer } from './product-offering.reducer';

export function getReducers(): ActionReducerMap<ProductOfferingState> {
  return {
    productOfferingMap: productOfferingReducer
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<ProductOfferingState>
> = new InjectionToken<ActionReducerMap<ProductOfferingState>>(
  'ProductOfferingReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};
