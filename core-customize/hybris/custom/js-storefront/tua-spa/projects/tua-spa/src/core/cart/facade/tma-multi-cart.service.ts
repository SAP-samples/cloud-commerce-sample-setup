// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { UserIdService } from '@spartacus/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TmaOrderEntry } from '../../model';
import * as TmaCartEntryActions from '../store/actions/tma-cart-entry.actions';
import { TmaMultiCartSelectors } from '../store/selectors';
import { MultiCartService, StateWithMultiCart } from '@spartacus/cart/base/core';
import { TmaMultiCartFacade } from '../root';

@Injectable({
  providedIn: 'root'
})
export class TmaMultiCartService extends MultiCartService implements TmaMultiCartFacade {

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected userIdService: UserIdService
  ) {
    super(store, userIdService);
  }

  /**
   * Adds the provided entry to given cart.
   *
   * @param userId - The identifier of the user
   * @param cartId - The identifier of the cart
   * @param cartEntry - The entry to be added
   */
  addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): void {
    this.store.dispatch(
      new TmaCartEntryActions.AddEntry({
        userId: userId,
        cartId: cartId,
        cartEntry: cartEntry
      })
    );
  }

  /**
   * Updates the provided entry in given cart.
   *
   * @param userId - The identifier of the user
   * @param cartId - The identifier of the cart
   * @param cartEntry - The entry to be updated
   */
  updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): void {
    this.store.dispatch(
      new TmaCartEntryActions.UpdateEntry({
        userId: userId,
        cartId: cartId,
        cartEntry: cartEntry
      })
    );
  }

  /**
   * Returns cart entry for provided entry number
   *
   * @param cartId - The identifier of the cart
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as an {@link Observable}
   */
  getEntryForEntryNumber(cartId: string, entryNumber: number): Observable<TmaOrderEntry | null> {
    return this.store.select(TmaMultiCartSelectors.getCartEntryForEntryNumberSelectorFactory(cartId, entryNumber));
  }

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param cartId - The identifier of the cart
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getSpoWithHighestEntryNumber(cartId: string, productCode: string): Observable<TmaOrderEntry | null> {
    return this.store.select(TmaMultiCartSelectors.getSpoWithHighestEntryNumberSelectorFactory(cartId, productCode));
  }

}
