// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum SelfcareActionTypes {
  LOAD_SUBSCRIPTIONS = '[Selfcare-subscriptions] Load Selfcare Subscriptions',
  LOAD_SUBSCRIPTIONS_SUCCESS = '[Selfcare-subscriptions] Load Selfcare Subscriptions Success',
  LOAD_SUBSCRIPTIONS_FAIL = '[Selfcare-subscriptions] Load Selfcare Subscriptions Fail',
  CLEAR_SUBSCRIPTIONS = '[Selfcare-subscriptions] Clear Selfcare Subscriptions',
  LOAD_BILLING_ACCOUNTS = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts',
  LOAD_BILLING_ACCOUNTS_SUCCESS = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts Success',
  LOAD_BILLING_ACCOUNTS_FAIL = '[Selfcare-billing-accounts] Load Selfcare Billing Accounts Fail',
  CLEAR_BILLING_ACCOUNTS = '[Selfcare-billing-accounts] Clear Selfcare Billing Accounts',
  LOAD_BILLING_AGREEMENTS = '[Selfcare-billing-agreements] Load Selfcare Billing Agreements',
  LOAD_BILLING_AGREEMENTS_SUCCESS = '[Selfcare-billing-agreements] Load Selfcare Billing Agreements Success',
  LOAD_BILLING_AGREEMENTS_FAIL = '[Selfcare-billing-agreements] Load Selfcare Billing Agreements Fail',
  CLEAR_BILLING_AGREEMENTS = '[Selfcare-billing-agreements] Clear Selfcare Billing Agreements',
  LOAD_CUSTOMER_BILLS = '[Selfcare-customer-bills] Load Selfcare Customer Bills',
  LOAD_CUSTOMER_BILLS_SUCCESS = '[Selfcare-customer-bills] Load Selfcare Customer Bills Success',
  LOAD_CUSTOMER_BILLS_FAIL = '[Selfcare-customer-bills] Load Selfcare Customer Bills Fail',
  CLEAR_CUSTOMER_BILLS = '[Selfcare-customer-bills] Clear Selfcare Customer Bills'
}

export class LoadSubscriptions implements Action {
  readonly type = SelfcareActionTypes.LOAD_SUBSCRIPTIONS;
  constructor() {
  }
}

export class LoadSubscriptionsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_SUBSCRIPTIONS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadSubscriptionsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_SUBSCRIPTIONS_FAIL;
  constructor(public payload: any) {}
}

export class ClearSubscriptionsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_SUBSCRIPTIONS;
  constructor() {
  }
}

// Billing Accounts
export class LoadBillingAccounts implements Action {
  readonly type = SelfcareActionTypes.LOAD_BILLING_ACCOUNTS;
  constructor() {
  }
}

export class LoadBillingAccountsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_BILLING_ACCOUNTS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadBillingAccountsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_BILLING_ACCOUNTS_FAIL;
  constructor(public payload: any) {}
}

export class ClearBillingAccountsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_BILLING_ACCOUNTS;
  constructor() {
  }
}

// Billing Agreements
export class LoadBillingAgreements implements Action{
  readonly type = SelfcareActionTypes.LOAD_BILLING_AGREEMENTS;
  constructor() {
  }
}

export class LoadBillingAgreementsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_BILLING_AGREEMENTS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadBillingAgreementsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_BILLING_AGREEMENTS_FAIL;
  constructor(public payload: any) {}
}

export class ClearBillingAgreementsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_BILLING_AGREEMENTS;
  constructor() {
  }
}

// Customer Bills
export class LoadCustomerBills implements Action {
  readonly type = SelfcareActionTypes.LOAD_CUSTOMER_BILLS;
}

export class LoadCustomerBillsSuccess implements Action {
  readonly type = SelfcareActionTypes.LOAD_CUSTOMER_BILLS_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadCustomerBillsFail implements Action {
  readonly type = SelfcareActionTypes.LOAD_CUSTOMER_BILLS_FAIL;
  constructor(public payload: any) {}
}

export class ClearCustomerBillsState implements Action {
  readonly type = SelfcareActionTypes.CLEAR_CUSTOMER_BILLS;
}

export type SelfcareActions =
  | LoadSubscriptions
  | LoadSubscriptionsSuccess
  | LoadSubscriptionsFail
  | ClearSubscriptionsState
  | LoadBillingAccounts
  | LoadBillingAccountsSuccess
  | LoadBillingAccountsFail
  | ClearBillingAccountsState
  | LoadBillingAgreements
  | LoadBillingAgreementsSuccess
  | LoadBillingAgreementsFail
  | ClearBillingAgreementsState
  | LoadCustomerBills
  | LoadCustomerBillsSuccess
  | LoadCustomerBillsFail
  | ClearCustomerBillsState;
