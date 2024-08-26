// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { TmaCartEntryAdapter } from '../store/adapters/tma-cart-entry.adapter';
import { TmaOrderEntry } from '../../model/tma-cart.entry.model';
import { CartEntryConnector } from '@spartacus/cart/base/core';
import { CartModification } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root',
})
export class TmaCartEntryConnector extends CartEntryConnector {
  constructor(protected adapter: TmaCartEntryAdapter) {
    super(adapter);
  }

  public addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.addCartEntry(userId, cartId, cartEntry);
  }

  public updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry,
  ): Observable<CartModification> {
    return this.adapter.updateCartEntry(userId, cartId, cartEntry);
  }
}
