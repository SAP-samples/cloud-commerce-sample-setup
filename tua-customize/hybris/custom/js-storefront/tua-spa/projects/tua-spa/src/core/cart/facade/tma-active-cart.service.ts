// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { OCC_CART_ID_CURRENT, UserIdService, WindowRef } from '@spartacus/core';
import { select, Store } from '@ngrx/store';
import { TmaMultiCartService } from './tma-multi-cart.service';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TmaOrderEntry } from '../../model';
import { ActiveCartService, MultiCartSelectors, StateWithMultiCart } from '@spartacus/cart/base/core';
import { ActiveCartFacade, CartType } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root'
})
export class TmaActiveCartService extends ActiveCartService implements ActiveCartFacade {

  protected tmaActiveCartId$ = this.store.pipe(
    select(MultiCartSelectors.getCartIdByTypeFactory(CartType.ACTIVE)),
    map(cartId => {
      if (!cartId) {
        return OCC_CART_ID_CURRENT;
      }
      return cartId;
    })
  );

  constructor(
    protected store: Store<StateWithMultiCart>,
    protected userIdService: UserIdService,
    protected multiCartService: TmaMultiCartService,
    protected winRef: WindowRef
  ) {
    super(multiCartService, userIdService, winRef);
  }

  /**
   * Returns cart entry for provided entry number
   *
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getEntryFor(entryNumber: number): Observable<TmaOrderEntry> {
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => this.multiCartService.getEntryForEntryNumber(cartId, entryNumber)),
      distinctUntilChanged()
    );
  }

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  getSpoWithHighestEntryNumber(productCode: string): Observable<TmaOrderEntry> {
    return this.tmaActiveCartId$.pipe(
      switchMap(cartId => this.multiCartService.getSpoWithHighestEntryNumber(cartId, productCode)),
      distinctUntilChanged()
    );
  }
}
