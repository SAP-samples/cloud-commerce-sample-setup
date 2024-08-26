// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { SubscriptionBaseDetailState } from '../subscription-base-details.state';
import { subscriptionBaseDetailsReducer } from './subscription-base-details.reducer';

export function getReducers(): ActionReducerMap<SubscriptionBaseDetailState> {
  return {
    subscriptionBaseDetailMap: subscriptionBaseDetailsReducer
  };
}
export const reducerToken: InjectionToken<ActionReducerMap<SubscriptionBaseDetailState>> = new InjectionToken<ActionReducerMap<SubscriptionBaseDetailState>>('subscriptionBaseDetailsReducer');
export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
export const metaReducers: MetaReducer<any>[] = [];
