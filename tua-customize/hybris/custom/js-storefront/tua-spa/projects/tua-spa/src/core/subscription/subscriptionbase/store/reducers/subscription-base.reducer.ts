// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SubscriptionBaseAction, SubscriptionBaseActionType } from '../actions/subscription-base.action';
import { SubscriptionBaseMap } from '../subscription-base.state';

const initialState: SubscriptionBaseMap[] = [];

/**
 * Function to handle the transitions of SubscriptionBaseState
 * @param state The state of the SubscriptionBaseState
 * @param action Dispatched action of {@link SubscriptionBaseAction}
 * @returns list of {@link SubscriptionBaseMap} of {@link SubscriptionBaseState}
 */
export function subscriptionBaseReducer(
  state = initialState,
  action: SubscriptionBaseAction
): SubscriptionBaseMap[] {
  switch (action.type) {
    case SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE_SUCCESS: {
      if (
        !state.find(
          (subscriptionBaseState: SubscriptionBaseMap) =>
            subscriptionBaseState.userId === action.payload.userId &&
            subscriptionBaseState.baseSiteId === action.payload.baseSiteId
        )
      ) {
        state = state.concat({
          subscription: action.payload.subscription,
          userId: action.payload.userId,
          baseSiteId: action.payload.baseSiteId,
        });
      }
      return state;
    }
    case SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE_FAIL:
    case SubscriptionBaseActionType.CLEAR_SUBSCRIPTION_BASES: {
      return initialState;
    }
  }
  return state;
}
