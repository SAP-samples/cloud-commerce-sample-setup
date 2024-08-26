// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { UsageConsumptionAction, UsageConsumptionActionType } from '../actions/usage-consumption.action';
import { UsageConsumptionMap } from '../usage-consumption.state';

const initialState: UsageConsumptionMap[] = [];

/**
 * Function to handle the transitions of UsageConsumptionState
 * @param state The state of the UsageConsumptionState
 * @param action Dispatched action of {@link UsageConsumptionAction}
 * @returns list of {@link UsageConsumptionMap} of {@link UsageConsumptionState}
 */
export function usageConsumptionReducer(
  state = initialState,
  action: UsageConsumptionAction
): UsageConsumptionMap[] {
  switch (action.type) {
    case UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION_SUCCESS: {
      if (
        !state.find(
          (usageConsumptionState: UsageConsumptionMap) =>
            usageConsumptionState.baseSiteId === action.payload.baseSiteId &&
            usageConsumptionState.subscriptionId ===
              action.payload.subscriptionId
        )
      ) {
        state = state.concat({
          subscriptionId: action.payload.subscriptionId,
          baseSiteId: action.payload.baseSiteId,
          usageConsumption: action.payload.usageConsumption,
        });
      }
      return state;
    }
    case UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION_FAIL:
    case UsageConsumptionActionType.CLEAR_USAGE_CONSUMPTION: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
