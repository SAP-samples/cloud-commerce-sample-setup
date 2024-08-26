// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../../model';
import { SearchConfig } from '@spartacus/core';

export abstract class TmaProductOrderAdapter {

  /**
   * Returns the list of product orders for the provided parameters.
   *
   * @param userId - The identifier of the user
   * @param baseSiteId - The identifier of the base site
   * @param searchConfig - The configuration used for pagination
   *
   * @return {@link PaginatedTmaProductOrder} as {@link Observable}
   */
  abstract getProductOrders(
    userId: string,
    baseSiteId: string,
    searchConfig?: SearchConfig
  ): Observable<TmaPaginatedProductOrder>;

  /**
   * Updates the order for the provided parameters.
   *
   * @param baseSiteId The id of the baseSite
   * @param orderId The id of the order to be updated
   * @param order The Product order
   * @return The updated order as {@link Observable} of {@link TmaProductOrder}
   */
  abstract updateOrder(
    baseSiteId: string,
    orderId: string,
    order: TmaProductOrder
  ): Observable<TmaProductOrder>;
}
