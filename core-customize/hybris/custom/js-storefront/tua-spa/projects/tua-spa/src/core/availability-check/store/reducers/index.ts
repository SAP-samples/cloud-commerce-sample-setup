// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { AvailabilityCheckState } from '../availability-check.state';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as availabilityCheckReducer from './availability-check.reducer';

export function getReducers(): ActionReducerMap<AvailabilityCheckState> {
  return {
    appliedCapacityAmountMap: availabilityCheckReducer.availabilityCheckReducer,
    selectedLogicalResource:
      availabilityCheckReducer.selectedLogicalResourceReducer,
    availabilityCheckError:
      availabilityCheckReducer.availabilityCheckErrorReducer,
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  AvailabilityCheckState
>> = new InjectionToken<ActionReducerMap<AvailabilityCheckState>>(
  'availabilityCheckReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};

export const metaReducers: MetaReducer<any>[] = [];
