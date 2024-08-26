// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaPremiseDetail, TmaTechnicalResources } from '../../model';

export const TMA_PREMISE_DETAIL_FEATURE = 'premise-detail';
export const TMA_PREMISE_DETAILS_DATA = '[Premise-detail] Premise Detail Data';

export interface TmaStateWithPremiseDetail {
  [TMA_PREMISE_DETAIL_FEATURE]: TmaPremiseDetailState;
}

export interface TmaPremiseDetailState {
  technicalResources?: TmaTechnicalResources;
  premiseDetail?: TmaPremiseDetail;
  error?: string;
}

export interface TmaPremiseDetailStates {
  premiseDetailState: TmaPremiseDetailState[];
}
