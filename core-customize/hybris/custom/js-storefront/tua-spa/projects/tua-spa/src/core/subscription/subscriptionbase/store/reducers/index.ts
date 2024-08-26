// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { SubscriptionBaseState } from '../subscription-base.state';
import { subscriptionBaseReducer } from './subscription-base.reducer';
import { InjectionToken, Provider } from '@angular/core';

export function getReducers(): ActionReducerMap<SubscriptionBaseState> {
  return {
    subscriptionBaseMap: subscriptionBaseReducer,
  };
}
export const reducerToken: InjectionToken<ActionReducerMap<
  SubscriptionBaseState
>> = new InjectionToken<ActionReducerMap<SubscriptionBaseState>>(
  'subscriptionBaseReducer'
);
export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
export const metaReducers: MetaReducer<any>[] = [];
