// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum SubscriptionBaseActionType {
  LOAD_SUBSCRIPTION_BASE = '[Subscription-base] Load Subscription Base',
  LOAD_SUBSCRIPTION_BASE_SUCCESS = '[Subscription-base] Load Subscription Base Success',
  LOAD_SUBSCRIPTION_BASE_FAIL = '[Subscription-base] Load Subscription Base Fail',
  CLEAR_SUBSCRIPTION_BASES = '[Subscription-base] Clear All Subscription Bases',
}

export class LoadSubscriptionBase implements Action {
  readonly type = SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE;
  constructor(
    public payload: {
      baseSiteId: string;
      userId: string;
    }
  ) {}
}

export class LoadSubscriptionBaseSuccess implements Action {
  readonly type = SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSubscriptionBaseFail implements Action {
  readonly type = SubscriptionBaseActionType.LOAD_SUBSCRIPTION_BASE_FAIL;
  constructor(public payload: any) {}
}

export class ClearAllSubscriptionBase implements Action {
  readonly type = SubscriptionBaseActionType.CLEAR_SUBSCRIPTION_BASES;
  constructor() {
  }
}

export type SubscriptionBaseAction =
  | LoadSubscriptionBase
  | LoadSubscriptionBaseSuccess
  | LoadSubscriptionBaseFail
  | ClearAllSubscriptionBase;
