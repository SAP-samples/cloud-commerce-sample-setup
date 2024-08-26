// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

/**
 * Premise details action types
 */
export enum TmaPremiseDetailActionTypes {
  VALIDATE_PREMISE_DETAIL = '[Premise-detail] Validate Premise Detail',
  VALIDATE_PREMISE_DETAIL_SUCCESS = '[Premise-detail] Validate Premise Detail Success',
  VALIDATE_PREMISE_DETAIL_FAIL = '[Premise-detail] Validate Premise Detail Fail'
}

/**
 * Action for validating the premise details
 */
export class ValidatePremiseDetail implements Action {
  readonly type = TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL;

  constructor(public payload: any) { }
}

/**
 * Validate premise details success action
 */
export class ValidatePremiseDetailSuccess implements Action {
  readonly type = TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL_SUCCESS;

  constructor(public payload: any) { }
}

/**
 * Validate premise details fail action
 */
export class ValidatePremiseDetailFail implements Action {
  readonly type = TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL_FAIL;

  constructor(public payload: any) { }
}

/**
 * Union of all the different premise detail action types supported
 */
export type TmaPremiseDetailActionType =
  | ValidatePremiseDetail
  | ValidatePremiseDetailSuccess
  | ValidatePremiseDetailFail;
