// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum RecommendationActionTypes {
  LOAD_RECOMMENDATION = '[Recommendation] Load Recommendation',
  LOAD_RECOMMENDATION_SUCCESS = '[Recommendation] Load Recommendation Success',
  LOAD_RECOMMENDATION_FAIL = '[Recommendation] Load Recommendation Fail',
  CLEAR_RECOMMENDATION_STATE = '[Recommendation] Clear Recommendation State'
}

export class LoadRecommendation implements Action {
  readonly type = RecommendationActionTypes.LOAD_RECOMMENDATION;
  constructor(public payload: any) {}
}

export class LoadRecommendationSuccess implements Action {
  readonly type = RecommendationActionTypes.LOAD_RECOMMENDATION_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadRecommendationFail implements Action {
  readonly type = RecommendationActionTypes.LOAD_RECOMMENDATION_FAIL;
  constructor(public payload: any) {}
}

export class ClearRecommendationState {
  readonly type = RecommendationActionTypes.CLEAR_RECOMMENDATION_STATE;
  constructor() {
  }
}

export type RecommendationAction =
  | LoadRecommendation
  | LoadRecommendationSuccess
  | LoadRecommendationFail
  | ClearRecommendationState;
