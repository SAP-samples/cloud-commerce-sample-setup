// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService, OccEndpointsService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCartModification, TmaOrderEntry } from '../../../model';
import { TmaCartEntryAdapter } from '../../../cart/store/adapters';
import { TMA_CART_MODIFICATION_NORMALIZER } from '../../../cart/connectors';
import { OccCartEntryAdapter } from '@spartacus/cart/base/occ';

@Injectable({
  providedIn: 'root'
})
export class TmaOccCartEntryAdapter extends OccCartEntryAdapter implements TmaCartEntryAdapter {

  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {
    super(http, occEndpointsService, converterService);
  }

  addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url = this.occEndpointsService.buildUrl('addEntries', {
      urlParams: { userId, cartId, quantity: cartEntry.quantity, code: cartEntry.product.code  }
    });
    return this.http
      .post<TmaCartModification>(url, cartEntry, { headers })
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }

  updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  ): Observable<TmaCartModification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const entryNumber = cartEntry.entryNumber;
    const url = this.occEndpointsService.buildUrl('updateEntries', {
      urlParams: { userId, cartId, entryNumber }
    });

    return this.http
      .patch<TmaCartModification>(url, cartEntry, { headers })
      .pipe(this.converterService.pipeable(TMA_CART_MODIFICATION_NORMALIZER));
  }
}
