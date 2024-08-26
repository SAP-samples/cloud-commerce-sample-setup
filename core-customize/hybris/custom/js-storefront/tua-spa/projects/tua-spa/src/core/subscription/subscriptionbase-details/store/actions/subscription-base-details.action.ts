// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum SubscriptionBaseDetailsActionType {
  LOAD_SUBSCRIPTION_BASE_DETAILS = '[Subscription-base-details] Load Subscription Base Details',
  LOAD_SUBSCRIPTION_BASE_DETAILS_SUCCESS = '[Subscription-base-details] Load Subscription Base Details Success',
  LOAD_SUBSCRIPTION_BASE_DETAILS_FAIL = '[Subscription-base-details] Load Subscription Base Details Fail',
  CLEAR_SUBSCRIPTION_BASE_DETAILS = '[Subscription-base-details] Clear Subscription Base Details',
}
export class LoadSubscriptionBaseDetails implements Action {
  readonly type =
    SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS;
  constructor(
    public payload: {
      baseSiteId: string;
      subscriptionBaseId: string;
    }
  ) {}
}

export class LoadSubscriptionBaseDetailsSuccess implements Action {
  readonly type =
    SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSubscriptionBaseDetailsFail implements Action {
  readonly type =
    SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS_FAIL;
  constructor(public payload: any) {}
}

export class ClearSubscriptionBaseDetails implements Action {
  readonly type =
    SubscriptionBaseDetailsActionType.CLEAR_SUBSCRIPTION_BASE_DETAILS;
  constructor() {
  }
}

export type SubscriptionBaseDetailAction =
  | LoadSubscriptionBaseDetails
  | LoadSubscriptionBaseDetailsSuccess
  | LoadSubscriptionBaseDetailsFail
  | ClearSubscriptionBaseDetails;
