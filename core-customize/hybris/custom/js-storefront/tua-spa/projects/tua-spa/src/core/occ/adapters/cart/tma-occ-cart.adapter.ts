// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { ConverterService, Occ, OCC_CART_ID_CURRENT, OccEndpointsService } from '@spartacus/core';
import { TMA_CART_NORMALIZER } from '../../../cart';
import { OccCartAdapter } from '@spartacus/cart/base/occ';
import { CartAdapter } from '@spartacus/cart/base/core';
import { Cart } from '@spartacus/cart/base/root';

@Injectable({
  providedIn: 'root',
})
export class TmaOccCartAdapter extends OccCartAdapter implements CartAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpointsService: OccEndpointsService,
    protected converterService: ConverterService
  ) {
    super(http, occEndpointsService, converterService);
  }

  /**
   * Retrieves all the cart for a given user.
   *
   * @param userId The identifier of the user
   * @return The list of cart as {@link Observable} of {@link Cart}
   */
  public loadAll(userId: string): Observable<Cart[]> {
    return this.http
      .get<Occ.CartList>(
        this.occEndpointsService.buildUrl('carts', { urlParams: { userId } })
      )
      .pipe(
        pluck('carts'),
        this.converterService.pipeableMany(TMA_CART_NORMALIZER)
      );
  }

  /**
   * Retrieves specific cart for a given user.
   *
   * @param userId The identifier of the user
   * @param cartId The identifier of the cart
   * @return The cart as {@link Observable} of {@link Cart}
   */
  public load(userId: string, cartId: string, baseSiteId?: string): Observable<Cart> {
    if (cartId === OCC_CART_ID_CURRENT) {
      return this.loadAll(userId).pipe(
        map((carts) => {
          if (carts) {
            return carts.find((cart) => {
              return cart['saveTime'] === undefined;
            });
          } else {
            return null;
          }
        })
      );
    } else {
      return this.http
        .get<Occ.Cart>(
          this.occEndpointsService.buildUrl('cart', { urlParams: { userId, cartId } })
        )
        .pipe(this.converterService.pipeable(TMA_CART_NORMALIZER));
    }
  }
}
