// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { UsageConsumptionState } from '../usage-consumption.state';
import { usageConsumptionReducer } from './usage-consumption.reducer';

export function getReducers(): ActionReducerMap<UsageConsumptionState> {
  return {
    usageConsumptionMap: usageConsumptionReducer,
  };
}
export const reducerToken: InjectionToken<ActionReducerMap<
  UsageConsumptionState
>> = new InjectionToken<ActionReducerMap<UsageConsumptionState>>(
  'usageConsumptionReducer'
);
export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};
export const metaReducers: MetaReducer<any>[] = [];
