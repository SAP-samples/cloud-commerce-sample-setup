// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { TmfProductState } from '../tmf-product.state';
import { InjectionToken, Provider } from '@angular/core';
import { tmfProductReducer } from './tmf-product.reducer';

export function getReducers(): ActionReducerMap<TmfProductState> {
  return {
    tmfProductMap: tmfProductReducer
  };
}

export const reducerToken: InjectionToken<
  ActionReducerMap<TmfProductState>
> = new InjectionToken<ActionReducerMap<TmfProductState>>('TmfProductReducer');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
export const metaReducers: MetaReducer<any>[] = [];
