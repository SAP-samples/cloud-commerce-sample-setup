// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum AvailabilityCheckActionTypes {
  LOAD_AVAILABILITY_CHECK = '[availability-check] Load Availability Check',
  LOAD_AVAILABILITY_CHECK_SUCCESS = '[availability-check] Load Availability Check Success',
  LOAD_AVAILABILITY_CHECK_FAIL = '[availability-check] Load Availability Check Fail',
  SELECTED_LOGICAL_RESOURCE_SUCCESS = '[availability-check] Selected Logical Resource Success',
  CLEAR_AVAILABILITY_CHECK_STATE = '[availability-check] Clear Availability Check State',
  CLEAR_AVAILABILITY_CHECK_ERROR = '[availability-check] Clear Availability Check Error',
  CLEAR_SELECTED_LOGICAL_RESOURCE_STATE = '[availability-check] Clear Selected Logical Resource State',
}

export class LoadAvailabilityCheck implements Action {
  readonly type = AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK;

  constructor(public payload: any) {
  }
}

export class LoadAvailabilityCheckSuccess implements Action {
  readonly type = AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadAvailabilityCheckFail implements Action {
  readonly type = AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK_FAIL;

  constructor(public payload: any) {
  }
}

export class SelectedLogicalResourceSuccess implements Action {
  readonly type =
    AvailabilityCheckActionTypes.SELECTED_LOGICAL_RESOURCE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ClearAvailabilityCheckState implements Action {
  readonly type = AvailabilityCheckActionTypes.CLEAR_AVAILABILITY_CHECK_STATE;

  constructor() {
  }
}

export class ClearAvailabilityCheckError implements Action {
  readonly type = AvailabilityCheckActionTypes.CLEAR_AVAILABILITY_CHECK_ERROR;

  constructor() {
  }
}

export class ClearSelectedLogicalResourceState implements Action {
  readonly type = AvailabilityCheckActionTypes.CLEAR_SELECTED_LOGICAL_RESOURCE_STATE;

  constructor() {
  }
}

export type AvailabilityCheckActions =
  | LoadAvailabilityCheck
  | LoadAvailabilityCheckSuccess
  | LoadAvailabilityCheckFail
  | SelectedLogicalResourceSuccess
  | ClearAvailabilityCheckState
  | ClearAvailabilityCheckError
  | ClearSelectedLogicalResourceState;
