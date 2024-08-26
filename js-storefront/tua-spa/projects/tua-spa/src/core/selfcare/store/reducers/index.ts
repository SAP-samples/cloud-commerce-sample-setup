// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken, Provider } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { SelfcareState } from '../selfcare-state';
import { BillingAccountsReducer, BillingAgreementsReducer, CustomerBillsReducer, SubscriptionsReducer } from './selfcare.reducer';

export function getReducers(): ActionReducerMap<SelfcareState> {
  return {
    subscriptionsMap: SubscriptionsReducer,
    billingAccountsMap: BillingAccountsReducer,
    billingAgreementsMap: BillingAgreementsReducer,
    customerBillsMap: CustomerBillsReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<SelfcareState>> =
  new InjectionToken<ActionReducerMap<SelfcareState>>('SelfcareRedcuer');

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};

export const metaReducers: MetaReducer<any>[] = [];
