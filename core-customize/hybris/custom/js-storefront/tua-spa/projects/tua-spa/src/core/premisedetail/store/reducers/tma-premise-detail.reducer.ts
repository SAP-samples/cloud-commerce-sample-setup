// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaPremiseDetail } from '../../../model';
import { TmaPremiseDetailActionType, TmaPremiseDetailActionTypes } from '../actions/tma-premise-detail.actions';
import { TmaPremiseDetailState } from '../tma-premise-detail.state';

const initialState: TmaPremiseDetailState[] = [];

/**
 * Reducer for premise details related actions
 *
 * @param state - The current state of the store
 * @param action - The action executed
 * @return List of {@link TmaPremiseDetailState}
 */
export function premiseDetailReducer(
  state = initialState,
  action: TmaPremiseDetailActionType
): TmaPremiseDetailState[] {
  switch (action.type) {
    case TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL_SUCCESS: {
      if (!state.find((premiseDetailState: TmaPremiseDetailState) =>
        TmaPremiseDetail.equals(premiseDetailState.premiseDetail, action.payload.premiseDetail))) {
        state = state.concat({
          premiseDetail: action.payload.premiseDetail,
          technicalResources: action.payload.technicalResources
        });
      }

      return state;
    }
    case TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL_FAIL: {
      state = state.concat({
        premiseDetail: action.payload.premiseDetail,
        technicalResources: {
          error: action.payload.error.message
        }
      });
      return state;
    }
  }
  return state;
}
