// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaCustomerBills,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../../model';

export abstract class SelfcareAdapter {
  /**
   * Retrieves the details for the given selfcare subscriptions with context as specified.
   * @return
   *         The product offering details as {@link Observable} of {@link TmaSubscriptions}
   */
  abstract getSubscriptions(): Observable<TmaSubscribedProductsInventory>;

  /**
   * Get subscribed product from inventory
   * @param productId
   */
  abstract getSubscribedProduct(
    productId: string
  ): Observable<TmaSubscriptions>;

  /**
   * Retrieves billing accounts from inventory.
   */
  abstract getBillingAccounts(): Observable<TmaBillingAccounts[]>;

  /**
   * Retrieves billing agreements from inventory.
   */
   abstract getBillingAgreements(): Observable<TmaBillingAgreements[]>;

  /**
   * Retrieves customer bills from inventory.
   */
   abstract getCustomerBills(): Observable<TmaCustomerBills[]>;
}
