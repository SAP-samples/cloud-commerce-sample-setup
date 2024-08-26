// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { TmaPremiseDetailState, TmaPremiseDetailStates } from '../tma-premise-detail.state';
import * as fromPremiseDetailReducer from './tma-premise-detail.reducer';

export function getReducers(): ActionReducerMap<TmaPremiseDetailStates> {
  return {
    premiseDetailState: fromPremiseDetailReducer.premiseDetailReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<TmaPremiseDetailState>> = new InjectionToken<ActionReducerMap<TmaPremiseDetailState>>('premiseDetailReducer');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};

export const metaReducers: MetaReducer<any>[] = [];
