// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaCustomerBills,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../model';
import { SelfcareAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class SelfcareConnector {
  constructor(protected adapter: SelfcareAdapter) {}

  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   * @return
   * The selfcare subscriptions details as {@link Observable} of {@link TmaSubscriptions}
   */
  public getSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    return this.adapter.getSubscriptions();
  }

  /**
   * Retrieves the Subscribed product from inventory
   * @param productId
   * @returns subscribed product
   */
  public getSubscribedProduct(productId: string): Observable<TmaSubscriptions> {
    return this.adapter.getSubscribedProduct(productId);
  }

  /**
   * Retrieves billing accounts from inventory
   * @returns billing accounts
   */
  public getBillingAccounts(): Observable<TmaBillingAccounts[]> {
    return this.adapter.getBillingAccounts();
  }

  /**
   * Retrieves billing agreements from inventory
   * @returns billing agreements
   */
   public getBillingAgreements(): Observable<TmaBillingAgreements[]> {
    return this.adapter.getBillingAgreements();
  }

  /**
   * Retrieves customer bills from inventory
   * @returns customer bills
   */
   public getCustomerBills(): Observable<TmaCustomerBills[]> {
    return this.adapter.getCustomerBills();
  }
}
