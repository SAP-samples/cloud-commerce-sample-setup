// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SelfcareActions, SelfcareActionTypes } from '../actions/selfcare.actions';
import { BillingAccountsMap, BillingAgreementsMap, CustomerBillsMap, SubscriptionsMap } from '../selfcare-state';

export const subscriptionsInitialState: SubscriptionsMap[] = [];
export const billingAccountsInitialState: BillingAccountsMap[] = [];
export const billingAgreementsInitialState: BillingAgreementsMap[] = [];
export const customerBillsInitialState: CustomerBillsMap[] = [];

/**
 * Selfcare Subscriptions Reducer
 * @param state
 * @param action
 * @returns SelfcareSubscriptions State
 */
export function SubscriptionsReducer(
  state = subscriptionsInitialState,
  action: SelfcareActions
): SubscriptionsMap[] {
  switch (action.type) {
    case SelfcareActionTypes.LOAD_SUBSCRIPTIONS_SUCCESS: {
      state = state.concat({
        subscriptions: action.payload.subscriptions
      });
      return state;
    }
    case SelfcareActionTypes.LOAD_SUBSCRIPTIONS_FAIL:
        case SelfcareActionTypes.CLEAR_SUBSCRIPTIONS: {
          state = subscriptionsInitialState;
          return state;
    }

  }
  return state;
}

/**
 * SelfcareBillingAccounts Reducer
 * @param state
 * @param action
 * @returns SelfcareBillingAccounts State
 */
export function BillingAccountsReducer(
  state = billingAccountsInitialState,
  action: SelfcareActions
): BillingAccountsMap[] {
  switch (action.type) {
    case SelfcareActionTypes.LOAD_BILLING_ACCOUNTS_SUCCESS: {
      state = state.concat({
        billingAccounts: action.payload.billingAccounts
      });
      return state;
    }
    case SelfcareActionTypes.LOAD_BILLING_ACCOUNTS_FAIL:
        case SelfcareActionTypes.CLEAR_BILLING_ACCOUNTS: {
          state = billingAccountsInitialState;
          return state;
        }
  }
  return state;
}

/**
 * SelfcareBillingAgreements Reducer
 * @param state
 * @param action
 * @returns SelfcareBillingAgreements State
 */
 export function BillingAgreementsReducer(
   state = billingAgreementsInitialState,
   action: SelfcareActions
 ): BillingAgreementsMap[] {
   switch (action.type) {
     case SelfcareActionTypes.LOAD_BILLING_AGREEMENTS_SUCCESS: {
       return state.concat({
         billingAgreements: action.payload.billingAgreements
       });
     }
     case SelfcareActionTypes.LOAD_BILLING_AGREEMENTS_FAIL:
     case SelfcareActionTypes.CLEAR_BILLING_AGREEMENTS: {
       return billingAgreementsInitialState;
     }
     default: {
       return state;
     }
   }
 }

/**
 * SelfcareCustomerBills Reducer
 * @param state
 * @param action
 * @returns SelfcareCustomerBills State
 */
 export function CustomerBillsReducer(
   state = customerBillsInitialState,
   action: SelfcareActions
 ): CustomerBillsMap[] {
   switch (action.type) {
     case SelfcareActionTypes.LOAD_CUSTOMER_BILLS_SUCCESS: {
       state = state.concat({
         customerBills: action.payload.customerBills
       });
       return state;
     }
     case SelfcareActionTypes.LOAD_CUSTOMER_BILLS_FAIL:
         case SelfcareActionTypes.CLEAR_CUSTOMER_BILLS: {
           state = customerBillsInitialState;
           return state;
         }
   }
   return state;
 }
