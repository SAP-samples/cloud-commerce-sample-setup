// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaProductOrderAdapter } from '../store/adapters';
import { Observable } from 'rxjs';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../model';
import { SearchConfig } from '@spartacus/core';

@Injectable({
  providedIn: 'root'
})
export class TmaProductOrderConnector {

  constructor(protected adapter: TmaProductOrderAdapter) {
  }

  /**
   * Retrieves the list of product orders for the given parameters.
   *
   * @param userId The identifier of the user
   * @param baseSiteId The identifier of the base site
   * @param searchConfig The configuration used for pagination
   *
   * @return {@link PaginatedTmaProductOrder} as {@link Observable}
   */
  getProductOrders(
    userId: string,
    baseSiteId: string,
    searchConfig?: SearchConfig
  ): Observable<TmaPaginatedProductOrder> {
    return this.adapter.getProductOrders(userId, baseSiteId, searchConfig);
  }

  /**
   * Updates the order for the given parameters.
   *
   * @param baseSiteId The id of the baseSite
   * @param orderId The id of the order to be updated
   * @param order The Product order
   * @returns {@link TmaProductOrder} as {@link Observable}
   *
   */
  updateOrder(
    baseSiteId: string,
    orderId: string,
    order: TmaProductOrder
  ): Observable<TmaProductOrder> {
    return this.adapter.updateOrder(baseSiteId, orderId, order);
  }
}
