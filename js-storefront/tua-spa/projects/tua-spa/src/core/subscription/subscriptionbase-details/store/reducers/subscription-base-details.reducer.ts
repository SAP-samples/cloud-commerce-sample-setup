// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SubscriptionBaseDetailAction, SubscriptionBaseDetailsActionType } from '../actions/subscription-base-details.action';
import { SubscriptionBaseDetailMap } from '../subscription-base-details.state';

const initialState: SubscriptionBaseDetailMap[] = [];

/**
 * Function to handle the transitions of SubscriptionBaseDetailState
 * @param state The state of the SubscriptionBaseDetailState
 * @param action Dispatched action of {@link SubscriptionBaseDetailAction}
 * @returns list of {@link SubscriptionBaseDetailMap} of {@link SubscriptionBaseDetailState}
 */
export function subscriptionBaseDetailsReducer(
  state = initialState,
  action: SubscriptionBaseDetailAction
): SubscriptionBaseDetailMap[] {
  switch (action.type) {
    case SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS_SUCCESS: {
      if (
        !state.find(
          (subscriptionBaseDetailState: SubscriptionBaseDetailMap) =>
            subscriptionBaseDetailState.subscriptionBaseId ===
              action.payload.subscriptionBaseId &&
            subscriptionBaseDetailState.baseSiteId === action.payload.baseSiteId
        )
      ) {
        state = state.concat({
          subscriptionBaseDetail: action.payload.subscriptionBaseDetail,
          subscriptionBaseId: action.payload.subscriptionBaseId,
          baseSiteId: action.payload.baseSiteId,
        });
      }
      return state;
    }
    case SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS_FAIL:
    case SubscriptionBaseDetailsActionType.CLEAR_SUBSCRIPTION_BASE_DETAILS: {
      return initialState;
    }
  }
  return state;
}
