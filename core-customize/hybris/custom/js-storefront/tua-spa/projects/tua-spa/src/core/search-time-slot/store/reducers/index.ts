// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import * as fromTmaSearchTimeSlotReducers from './search-time-slot.reducer';
import { SEARCH_TIME_SLOT_DATA, SearchTimeSlotState } from '../search-time-slot.state';
import { SearchTimeSlot } from '../../..';
import { StateUtils } from '@spartacus/core';

export function getReducers(): ActionReducerMap<SearchTimeSlotState> {
  return {
    searchTimeSlots: StateUtils.loaderReducer<SearchTimeSlot>(
      SEARCH_TIME_SLOT_DATA,
      fromTmaSearchTimeSlotReducers.searchTimeSlotReducer
    ),
    selectedTimeSlot: fromTmaSearchTimeSlotReducers.selectedTimeSlotReducer,
    error: fromTmaSearchTimeSlotReducers.searchTimeSlotErrorReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  SearchTimeSlotState
>> = new InjectionToken<ActionReducerMap<SearchTimeSlotState>>(
  'SearchTimeSlotReducers'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};
