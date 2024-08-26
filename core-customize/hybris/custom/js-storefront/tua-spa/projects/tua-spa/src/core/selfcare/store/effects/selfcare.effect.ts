// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { ProductRef, TmaBillingAccounts, TmaBillingAgreements, TmaCustomerBills, TmaSubscriptions } from '../../../model';
import { SelfcareConnector } from '../../connectors/selfcare.connector';
import { SelfcareActions } from '../actions';
import { SelfcareActionTypes } from '../actions/selfcare.actions';

@Injectable()
export class SelfcareEffect {
  constructor(
    protected actions$: Actions,
    protected selfcareConnector: SelfcareConnector
  ) {}

  getSubscriptions$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_SUBSCRIPTIONS),
    switchMap(() => this.selfcareConnector.getSubscriptions()),
    switchMap((products: any) => {
      const result = [];
      if (products) {
        Object.values(products).forEach((item: TmaSubscriptions) => {
          if (item.isBundle) {
            item.product.forEach((product: ProductRef) =>
              result.push(
                this.selfcareConnector.getSubscribedProduct(product.id)
              )
            );
          }
        });
        if (result.length === 0) {
          return of(new SelfcareActions.LoadSubscriptionsSuccess({
            subscriptions: {
              subscribedProducts: Object.values(products)
            }
          }))
        }
      }
      return forkJoin(...result).pipe(
        map(
          (data) =>
            new SelfcareActions.LoadSubscriptionsSuccess({
              subscriptions: {
                subscribedProducts: Object.values(products),
                childrens: data
              }
            })
        )
      );
    })
  )
  );

  getBillingAccounts$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_BILLING_ACCOUNTS),
    map((action: SelfcareActions.LoadBillingAccounts) => {}),
    mergeMap(() => {
      return this.selfcareConnector.getBillingAccounts().pipe(
        map(
          (billingAccounts: TmaBillingAccounts[]) =>
            new SelfcareActions.LoadBillingAccountsSuccess({
              billingAccounts: billingAccounts
            })
        ),
        catchError((error: any) =>
          of(
            new SelfcareActions.LoadBillingAccountsFail({
              errorResponse: makeErrorSerializable(error)
            })
          )
        )
      );
    })
  )
  );

  getBillingAgreements$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_BILLING_AGREEMENTS),
    map((action: SelfcareActions.LoadBillingAgreements) => {}),
    mergeMap(() => {
      return this.selfcareConnector.getBillingAgreements().pipe(
        map(
          (billingAgreements: TmaBillingAgreements[]) =>
            new SelfcareActions.LoadBillingAgreementsSuccess({
              billingAgreements: billingAgreements
            })
        ),
        catchError((error: any) =>
          of(
            new SelfcareActions.LoadBillingAgreementsFail({
              errorResponse: makeErrorSerializable(error)
            })
          )
        )
      );
    })
  )
  );


  getCustomerBills$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SelfcareActionTypes.LOAD_CUSTOMER_BILLS),
    map((action: SelfcareActions.LoadCustomerBills) => {}),
    mergeMap(() => {
      return this.selfcareConnector.getCustomerBills().pipe(
        map(
          (customerBills: TmaCustomerBills[]) =>
            new SelfcareActions.LoadCustomerBillsSuccess({
              customerBills: customerBills
            })
        ),
        catchError((error: any) =>
          of(
            new SelfcareActions.LoadCustomerBillsFail({
              errorResponse: makeErrorSerializable(error)
            })
          )
        )
      );
    })
  )
  );
}
