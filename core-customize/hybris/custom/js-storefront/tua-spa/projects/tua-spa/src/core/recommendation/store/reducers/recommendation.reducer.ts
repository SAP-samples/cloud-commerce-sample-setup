// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { RecommendationAction, RecommendationActionTypes } from '../actions/recommendation.action';
import { RecommendationMap } from '../recommendation.state';

const initialState: RecommendationMap[] = [];

export function RecommendationReducer(
  state = initialState,
  action: RecommendationAction
): RecommendationMap[] {
  switch (action.type) {
    case RecommendationActionTypes.LOAD_RECOMMENDATION_SUCCESS: {
      if (
        !state.find(
          (recommendationState: RecommendationMap) =>
            recommendationState.subscriptionBaseId ===
              action.payload.subscriptionBaseId &&
            recommendationState.processTypeId === action.payload.processTypeId
        )
      ) {
        state = state.concat({
          subscriptionBaseId: action.payload.subscriptionBaseId,
          processTypeId: action.payload.processTypeId,
          recommendation: action.payload.recommendations,
          isSubscriptionEligibleForProcessType: true
        });
      }
      return state;
    }
    case RecommendationActionTypes.LOAD_RECOMMENDATION_FAIL: {
      if (
        !state.find(
          (recommendationState: RecommendationMap) =>
            recommendationState.subscriptionBaseId ===
              action.payload.subscriptionBaseId &&
            recommendationState.processTypeId === action.payload.processTypeId
        )
      ) {
        state = state.concat({
          subscriptionBaseId: action.payload.subscriptionBaseId,
          processTypeId: action.payload.processTypeId,
          error: action.payload.error,
          isSubscriptionEligibleForProcessType: false
        });
      }
      return state;
    }
    case RecommendationActionTypes.CLEAR_RECOMMENDATION_STATE: {
      return initialState;
    }
  }
  return state;
}
