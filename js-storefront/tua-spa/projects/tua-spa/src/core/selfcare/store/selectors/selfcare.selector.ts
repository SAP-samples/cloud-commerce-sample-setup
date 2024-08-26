// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaCustomerBills,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../../model';
import {
  BillingAccountsMap,
  BillingAgreementsMap,
  CustomerBillsMap,
  SELFCARE_FEATURE,
  SelfcareState,
  StateWithSelfcare,
  SubscriptionsMap
} from '../selfcare-state';

// Selfcare Subscriptions
export const getSelfcareFeatureState: MemoizedSelector<
  StateWithSelfcare,
  SelfcareState
> = createFeatureSelector<SelfcareState>(SELFCARE_FEATURE);

export const getSubscriptionsMap: MemoizedSelector<
  StateWithSelfcare,
  SubscriptionsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.subscriptionsMap
);

export const getSubscriptions: MemoizedSelector<
  StateWithSelfcare,
  TmaSubscribedProductsInventory
  > = createSelector(getSubscriptionsMap, (state: SubscriptionsMap[]) => {
  const selfcare: SubscriptionsMap = state.find(
    (selfcareState) => selfcareState.subscriptions
  );

  return selfcare ? selfcare.subscriptions : undefined;
});

export const getSubscribedProduct: MemoizedSelectorWithProps<
  StateWithSelfcare,
  any,
  TmaSubscriptions
> = createSelector(getSubscriptionsMap, (state: SubscriptionsMap[], props) => {
  const selfcare: SubscriptionsMap = state.find(
    (selfcareState) => selfcareState.subscriptions
  );
  if (!selfcare) {
    return undefined;
  }
  const subscribedProduct = selfcare.subscriptions.subscribedProducts.find(
    (product: TmaSubscriptions) => product.name === props.productId
  );
  if (!subscribedProduct) {
    // check product in childrens
    const product = selfcare.subscriptions.childrens.find(
      (children: TmaSubscriptions) => children.name === props.productId
    );
    if (!product) {
      return undefined;
    }
    return product;
  }
  return subscribedProduct;
});

// Billing Accounts
export const getBillingAccountsMap: MemoizedSelector<
  StateWithSelfcare,
  BillingAccountsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.billingAccountsMap
);

export const getBillingAccounts: MemoizedSelector<
  StateWithSelfcare,
  TmaBillingAccounts[]
> = createSelector(
  getBillingAccountsMap,
  (state: BillingAccountsMap[]) => {
    const selfcare: BillingAccountsMap = state
      ? state.find((selfcareState) => selfcareState.billingAccounts)
      : undefined;

    return selfcare ? selfcare.billingAccounts : [];
  }
);

/**
 * Get billing account details for specific account id
 */
export const getBillingAccountDetails: MemoizedSelectorWithProps<
  StateWithSelfcare,
  any,
  TmaBillingAccounts
> = createSelector(
  getBillingAccountsMap,
  (state: BillingAccountsMap[], props) => {
    const billingAccountsMap: BillingAccountsMap = state.find(
      (selfcareState) => selfcareState.billingAccounts
    );
    if (!billingAccountsMap) {
      return undefined;
    }

    const billingAccunt: TmaBillingAccounts =
      billingAccountsMap.billingAccounts.find(
        (account: TmaBillingAccounts) => account.id === props.accountId
      );

    return billingAccunt;
  }
);

// Billing Agreements
export const getBillingAgreementsMap: MemoizedSelector<
  StateWithSelfcare,
  BillingAgreementsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.billingAgreementsMap
);

export const getBillingAgreements: MemoizedSelector<
StateWithSelfcare,
TmaBillingAgreements[]
> = createSelector(
getBillingAgreementsMap,
(state: BillingAgreementsMap[]) => {
  const selfcare: BillingAgreementsMap = state
    ? state.find((selfcareState) => selfcareState.billingAgreements)
    : undefined;

  return selfcare ? selfcare.billingAgreements : [];
}
);

/**
 * Get billing agreement details for specific agreement id
 */
 export const getBillingAgreementDetails: MemoizedSelectorWithProps<
 StateWithSelfcare,
 any,
 TmaBillingAgreements
> = createSelector(
 getBillingAgreementsMap,
 (state: BillingAgreementsMap[], props) => {
   const billingAgreementsMap: BillingAgreementsMap = state.find(
     (selfcareState) => selfcareState.billingAgreements
   );
   if (!billingAgreementsMap) {
     return undefined;
   }
   const billingAgreement: TmaBillingAgreements =
     billingAgreementsMap.billingAgreements.find(
       (agreement: TmaBillingAgreements) => agreement.id === props.agreementId
     );

   return billingAgreement;
 }
);

// Customer Bills
export const getCustomerBillsMap: MemoizedSelector<
  StateWithSelfcare,
  CustomerBillsMap[]
> = createSelector(
  getSelfcareFeatureState,
  (state: SelfcareState) => state.customerBillsMap
);

export const getCustomerBills: MemoizedSelector<
  StateWithSelfcare,
  TmaCustomerBills[]
> = createSelector(
  getCustomerBillsMap,
  (state: CustomerBillsMap[]) => {
    const selfcare: CustomerBillsMap = state
      ? state.find((selfcareState) => selfcareState.customerBills)
      : undefined;

    return selfcare ? selfcare.customerBills : [];
  }
);

/**
 * Get customer bill details for specific bill id
 */
 export const getCustomerBillDetails: MemoizedSelectorWithProps<
 StateWithSelfcare,
 any,
 TmaCustomerBills
> = createSelector(
 getCustomerBillsMap,
 (state: CustomerBillsMap[], props) => {
   const customerBillsMap: CustomerBillsMap = state.find(
     (selfcareState) => selfcareState.customerBills
   );
   if (!customerBillsMap) {
     return undefined;
   }
   const customerBill: TmaCustomerBills =
     customerBillsMap.customerBills.find(
       (bill: TmaCustomerBills) => bill.id === props.customerBillId
     );

   return customerBill;
 }
);
