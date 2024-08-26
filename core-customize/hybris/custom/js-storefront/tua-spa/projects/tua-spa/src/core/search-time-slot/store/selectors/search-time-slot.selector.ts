// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { SEARCH_TIME_SLOT_FEATURE, SearchTimeSlotState, StateWithSearchTimeSlot } from '../search-time-slot.state';
import { SearchTimeSlot } from '../../../model';
import { StateUtils } from '@spartacus/core';

export const getTmfSearchTimeSlotFeatureState: MemoizedSelector<
  StateWithSearchTimeSlot,
  SearchTimeSlotState
> = createFeatureSelector<SearchTimeSlotState>(SEARCH_TIME_SLOT_FEATURE);

export const getSearchTimeSlotsState: MemoizedSelector<
  StateWithSearchTimeSlot,
  StateUtils.LoaderState<SearchTimeSlot>
> = createSelector(
  getTmfSearchTimeSlotFeatureState,
  (state: SearchTimeSlotState) => state.searchTimeSlots
);

export const getAllSearchTimeSlots: MemoizedSelector<
  StateWithSearchTimeSlot,
  SearchTimeSlot
> = createSelector(getSearchTimeSlotsState, StateUtils.loaderValueSelector);

export const getSelectedTimeSlots: MemoizedSelector<
  StateWithSearchTimeSlot,
  SearchTimeSlot
> = createSelector(
  getTmfSearchTimeSlotFeatureState,
  (state: SearchTimeSlotState) => state.selectedTimeSlot
);

export const getSearchTimeSlotError: MemoizedSelector<
  StateWithSearchTimeSlot,
  string
> = createSelector(
  getTmfSearchTimeSlotFeatureState,
  (state: SearchTimeSlotState) => state.error
);
