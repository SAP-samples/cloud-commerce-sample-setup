// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';
import { RecommendationState } from '../../..';
import { RecommendationReducer } from './recommendation.reducer';

export function getReducers(): ActionReducerMap<RecommendationState> {
  return {
    recommendationMap: RecommendationReducer
  };
}
export const reducerToken: InjectionToken<ActionReducerMap<
  RecommendationState
>> = new InjectionToken<ActionReducerMap<RecommendationState>>(
  'RecommendationReducers'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};
