// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AvailabilityCheckActions, AvailabilityCheckActionTypes } from '../actions/availability-check.action';
import { AvailabilityCheckMap } from '../availability-check.state';
import { ResourceRef } from '../../../model';

export const initialState: AvailabilityCheckMap[] = [];
export const selectedLogicalResourceInitialState: ResourceRef = null;
export const errorInitialState: string = null;

/**
 * Availability Check Reducer
 *
 * @param state
 *          state of initialState
 * @param  action
 *           action of AvailabilityCheckActions
 * @return
 *       List of AvailabilityCheckMap
 */
export function availabilityCheckReducer(
  state = initialState,
  action: AvailabilityCheckActions
): AvailabilityCheckMap[] {
  switch (action.type) {
    case AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK_SUCCESS: {
      state = initialState;
      state = state.concat({
        appliedCapacityAmount:
        action.payload.appliedCapacityAmount.appliedResourceCapacity
      });
      return state;
    }
    case AvailabilityCheckActionTypes.CLEAR_AVAILABILITY_CHECK_STATE: {
      return initialState;
    }
  }
  return state;
}

/**
 * Selected Logical Resource Reducer
 *
 * @param state
 *          state of selectedLogicalResourceInitialState
 * @param  action
 *           action of AvailabilityCheckActions
 * @return
 *       selected ResourceRef
 */
export function selectedLogicalResourceReducer(
  state = selectedLogicalResourceInitialState,
  action: AvailabilityCheckActions
): ResourceRef {
  switch (action.type) {
    case AvailabilityCheckActionTypes.SELECTED_LOGICAL_RESOURCE_SUCCESS: {
      return action.payload;
    }
    case AvailabilityCheckActionTypes.CLEAR_SELECTED_LOGICAL_RESOURCE_STATE: {
      return selectedLogicalResourceInitialState;
    }
  }
  return state;
}

/**
 * Availability Check Error Reducer
 *
 * @param state
 *          state of errorInitialState
 * @param  action
 *           action of AvailabilityCheckActions
 * @return
 *        error message
 */
export function availabilityCheckErrorReducer(
  state = errorInitialState,
  action: AvailabilityCheckActions
): string {
  switch (action.type) {
    case AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK_FAIL: {
      return action.payload;
    }
    case AvailabilityCheckActionTypes.CLEAR_AVAILABILITY_CHECK_STATE: {
      return errorInitialState;
    }
  }
  return state;
}
