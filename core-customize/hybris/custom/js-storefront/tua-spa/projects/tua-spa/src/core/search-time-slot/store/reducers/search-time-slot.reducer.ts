// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SearchTimeSlotAction, SearchTimeSlotActionTypes } from '../actions/search-time-slot.action';
import { SearchTimeSlot } from '../../../model';

export const searchTimeSlotInitialState: SearchTimeSlot = {};
export const selectedTimeSlotInitialState: SearchTimeSlot = {};
export const searchTimeSlotErrorInitialState: string = null;

/**
 * Update the state with available time slots
 *
 * @param state
 *             The state of the SearchTimeSlotState
 * @param action
 *             Dispatched action of {@link SearchTimeSlotAction}
 * @returns
 *        list of {@link SearchTimeSlot} of {@link SearchTimeSlotState}
 */
export function searchTimeSlotReducer(
  state = searchTimeSlotInitialState,
  action: SearchTimeSlotAction
): SearchTimeSlot {
  switch (action.type) {
    case SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_SUCCESS: {
      return action.payload;
    }
    case SearchTimeSlotActionTypes.CLEAR_SEARCH_TIME_SLOT_STATE: {
      return searchTimeSlotInitialState;
    }
  }
  return state;
}

/**
 * Update the state with selected time slot
 * @param state The state of the SearchTimeSlotState
 * @param action Dispatched action of {@link SearchTimeSlotAction}
 * @returns list of {@link TimeSlot} of {@link SearchTimeSlotState}
 */
export function selectedTimeSlotReducer(
  state = selectedTimeSlotInitialState,
  action: SearchTimeSlotAction
): SearchTimeSlot {
  switch (action.type) {
    case SearchTimeSlotActionTypes.SELECTED_TIME_SLOT_SUCCESS: {
      return {
        requestedTimeSlot: [action.payload.requestedTimeSlot],
        relatedPlace: action.payload.relatedPlace
      };
    }
    case SearchTimeSlotActionTypes.CLEAR_SELECTED_SEARCH_TIME_SLOT_STATE: {
      return selectedTimeSlotInitialState;
    }
    default: {
      return state;
    }
  }
}

/**
 * Update the state with error occured during search timeslot API call
 * @param state The state of the SearchTimeSlotState
 * @param action Dispatched action of {@link SearchTimeSlotAction}
 * @returns error as {@link string} of {@link SearchTimeSlotState}
 */
export function searchTimeSlotErrorReducer(
  state = searchTimeSlotErrorInitialState,
  action: SearchTimeSlotAction
): string {
  switch (action.type) {
    case SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT_FAIL: {
      return action.payload;
    }
    case SearchTimeSlotActionTypes.CLEAR_SEARCH_TIME_ERROR_STATE: {
      return searchTimeSlotErrorInitialState;
    }
  }
  return state;
}
