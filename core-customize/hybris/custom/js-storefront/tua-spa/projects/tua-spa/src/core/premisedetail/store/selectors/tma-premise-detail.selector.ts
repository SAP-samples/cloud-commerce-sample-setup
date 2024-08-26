// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { TmaPremiseDetail, TmaTechnicalResources } from '../../../model';
import {
  TMA_PREMISE_DETAIL_FEATURE,
  TmaPremiseDetailState,
  TmaPremiseDetailStates,
  TmaStateWithPremiseDetail
} from '../tma-premise-detail.state';

/**
 * Returns the premise details state.
 *
 * @return A {@link TmaPremiseDetailStates}
 */
export const getPremiseDetailFeatureState: MemoizedSelector<TmaStateWithPremiseDetail, TmaPremiseDetailStates> =
  createFeatureSelector<TmaPremiseDetailStates>(TMA_PREMISE_DETAIL_FEATURE);

/**
 * Returns the premise details from the store.
 *
 * @return List of {@link TmaPremiseDetailState}
 */
export const getAllPremiseDetailStates: MemoizedSelector<TmaStateWithPremiseDetail, TmaPremiseDetailState[]> =
  createSelector(getPremiseDetailFeatureState, (state: TmaPremiseDetailStates) => {
    return state.premiseDetailState;
  });

/**
 * Returns the technical resources for the provided premise detail
 *
 * @return A {@link TmaTechnicalResources}
 */
export const getTechnicalResources: MemoizedSelectorWithProps<TmaStateWithPremiseDetail, any, TmaTechnicalResources> =
  createSelector(getAllPremiseDetailStates, (state: TmaPremiseDetailState[], props: any) => {
    const states: TmaPremiseDetailState = state ? state.find((pd: TmaPremiseDetailState) => TmaPremiseDetail.equals(pd.premiseDetail, props.premiseDetail)) : undefined;
    return states ? states.technicalResources : null;
  });
