// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BaseSiteService, Command, CommandService } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaCustomerBills,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../model';
import { SelfcareActions } from '../store';
import * as SelfcareSelectors from '../store/selectors/selfcare.selector';
import { StateWithSelfcare } from '../store/selfcare-state';
import { SelfcareConnector } from '../connectors';

@Injectable({
  providedIn: 'root'
})
export class SelfcareService implements OnDestroy {
  protected baseSiteId: string;
  protected subscription = new Subscription();

  protected getSubscribedProductById: Command<{ subscribedProductId: string }> =
    this.commandService.create<{ baseSiteId: string, subscribedProductId: string }>(
      (payload) =>
        this.selfcareConnector.getSubscribedProduct(payload.subscribedProductId).pipe(
          tap((subscription) => {
            return subscription;
          })
        )
    );

  constructor(
    protected store: Store<StateWithSelfcare>,
    protected baseSiteService: BaseSiteService,
    protected selfcareConnector: SelfcareConnector,
    protected commandService: CommandService,
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   *
   * @return
   *         The selfcare subscriptions details as {@link Observable} of {@link TmaSubscriptions}
   */
  getSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    return this.store.pipe(
      select(SelfcareSelectors.getSubscriptions),
      tap((subscriptions: TmaSubscribedProductsInventory) => {
        if (
          subscriptions === undefined ||
          Object.keys(subscriptions).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadSubscriptions());
        }
      })
    );
  }

  /**
   * Get Subscribed Product from Inventory
   * @param productId
   * @returns Subscribed Product
   */
  getSubscribedProduct(productId: string): Observable<TmaSubscriptions> {
    return this.store.pipe(
      select(SelfcareSelectors.getSubscribedProduct, {
        productId: productId
      })
    );
  }

  /**
   * Retrieves the subscribed product by subscribedProductId.
   *
   * @param subscribedProductId The id of the subscribed product
   */
  getSubscribedProductBy(
    subscribedProductId: string
  ): Observable<TmaSubscriptions> {
    return this.getSubscribedProductById.execute({ subscribedProductId});
  }

  /**
   * Clears the state of selfcare subscriptions.
   */
  clearSubscriptionsState(): void {
    this.store.dispatch(new SelfcareActions.ClearSubscriptionsState());
  }

  /***
   * Retrieves Selfcare Billing Accounts from Inventory
   */
  getBillingAccounts(): Observable<TmaBillingAccounts[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAccounts),
      tap((billingAccounts: TmaBillingAccounts[]) => {
        if (
          billingAccounts === undefined ||
          Object.keys(billingAccounts).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadBillingAccounts());
        }
      })
    );
  }

  /**
   * Get billing account details for specific billing account id
   * @param accountId Account Id
   * @returns Billing Account Details
   */
  getBillingAccountDetails(
    accountId: string
  ): Observable<TmaBillingAccounts> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAccountDetails, {
        accountId: accountId
      })
    );
  }

  /***
   * Retrieves Selfcare Billing Agreements from Inventory
   */
   getBillingAgreements(): Observable<TmaBillingAgreements[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAgreements),
      tap((billingAgreements: TmaBillingAgreements[]) => {
        if (
          billingAgreements === undefined ||
          Object.keys(billingAgreements).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadBillingAgreements());
        }
      })
    );
  }

  /**
   * Get billing agreement details for specific billing agreement id
   * @param agreementId Agreement Id
   * @returns Billing Agreement Details
   */
    getBillingAgreementDetails(
    agreementId: string
  ): Observable<TmaBillingAgreements> {
    return this.store.pipe(
      select(SelfcareSelectors.getBillingAgreementDetails, {
        agreementId: agreementId
      })
    );
  }


  /**
   * Retrieves Selfcare Customer Bills from Inventory
   */
   getCustomerBills(): Observable<TmaCustomerBills[]> {
    return this.store.pipe(
      select(SelfcareSelectors.getCustomerBills),
      tap((customerBills: TmaCustomerBills[]) => {
        if (
          customerBills === undefined ||
          Object.keys(customerBills).length === 0
        ) {
          this.store.dispatch(new SelfcareActions.LoadCustomerBills());
        }
      })
    );
  }

  /**
   * Get customer bill details for specific customer bill id
   * @param customerBillId Customer Bill Id
   * @returns Customer Bill Details
   */
   getCustomerBillDetails(
    customerBillId: string
  ): Observable<TmaCustomerBills> {
    return this.store.pipe(
      select(SelfcareSelectors.getCustomerBillDetails, {
        customerBillId: customerBillId
      })
    );
  }
}
