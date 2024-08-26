// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum UsageConsumptionActionType {
  LOAD_USAGE_CONSUMPTION = '[UsageConsumption] Load UsageConsumption',
  LOAD_USAGE_CONSUMPTION_SUCCESS = '[UsageConsumption] Load UsageConsumption Success',
  LOAD_USAGE_CONSUMPTION_FAIL = '[UsageConsumption] Load UsageConsumption Fail',
  CLEAR_USAGE_CONSUMPTION = '[UsageConsumption] Clear UsageConsumption ',
}

export class LoadUsageConsumption implements Action {
  readonly type = UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION;
  constructor(
    public payload: {
      baseSiteId: string;
      subscriptionId: string;
    }
  ) {}
}

export class LoadUsageConsumptionSuccess implements Action {
  readonly type = UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadUsageConsumptionFail implements Action {
  readonly type = UsageConsumptionActionType.LOAD_USAGE_CONSUMPTION_FAIL;
  constructor(public payload: any) {}
}

export class ClearUsageConsumptionDetails implements Action {
  readonly type = UsageConsumptionActionType.CLEAR_USAGE_CONSUMPTION;
  constructor() {
  }
}

export type UsageConsumptionAction =
  | LoadUsageConsumption
  | LoadUsageConsumptionSuccess
  | LoadUsageConsumptionFail
  | ClearUsageConsumptionDetails;
