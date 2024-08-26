// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TmaPaginatedProductOrder, TmaProductOrder } from '../../model';
import { Observable } from 'rxjs';
import { TmaProductOrderSelectors } from '../store/selectors';
import { StateWithProductOrder } from '../store';
import { SearchConfig } from '@spartacus/core';
import { TmaProductOrderAction } from '../store/actions';

@Injectable({ providedIn: 'root' })
export class TmaProductOrderService {
  constructor(
    protected store: Store<StateWithProductOrder>
  ) {
  }


  /**
   * Performs the necessary checkout preconditions.
   */

  /**
   * Returns the paginated product orders from the store.
   *
   * @return {@link PaginatedTmaProductOrder} as {@link Observable}
   */
  getPaginatedProductOrders(): Observable<TmaPaginatedProductOrder> {
    return this.store.pipe(select(TmaProductOrderSelectors.getPaginatedProductOrders));
  }

  /**
   * Loads the product orders for the provided parameters into the store.
   *
   * @param userId - The identifier of the user
   * @param baseSiteId - The identifier of the base site
   * @param searchConfig - The configuration used for pagination
   */
  loadProductOrders(
    userId: string,
    baseSiteId: string,
    searchConfig?: SearchConfig
  ): void {
    this.store.dispatch(
      new TmaProductOrderAction.LoadProductOrders({
        userId: userId,
        baseSiteId: baseSiteId,
        searchConfig: searchConfig
      })
    );
  }

  /**
   * Updates the order for given parameters
   *
   * @param baseSiteId The id of the baseSite
   * @param orderId The id of the order to be updated
   * @param order The Product order
   */
  updateOrder(
    baseSiteId: string,
    orderId: string,
    order: TmaProductOrder
  ): void {
    this.store.dispatch(
      new TmaProductOrderAction.UpdateOrder({
        baseSiteId: baseSiteId,
        orderId: orderId,
        order: order
      })
    );
  }
}
