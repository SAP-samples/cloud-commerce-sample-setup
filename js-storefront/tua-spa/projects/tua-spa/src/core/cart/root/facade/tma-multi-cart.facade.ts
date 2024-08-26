/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { facadeFactory } from '@spartacus/core';
import { Observable } from 'rxjs';
import { CART_BASE_CORE_FEATURE, MultiCartFacade } from '@spartacus/cart/base/root';
import { TmaOrderEntry } from '../../../model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: TmaMultiCartFacade,
      feature: CART_BASE_CORE_FEATURE,
      methods: [
        'addCartEntry',
        'updateCartEntry',
        'getEntryForEntryNumber',
        'getSpoWithHighestEntryNumber'
      ],
      async: true,
    }),
})
export abstract class TmaMultiCartFacade extends MultiCartFacade {
  /**
   * Adds the provided entry to given cart.
   *
   * @param userId - The identifier of the user
   * @param cartId - The identifier of the cart
   * @param cartEntry - The entry to be added
   */
  abstract addCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  )

  /**
   * Updates the provided entry in given cart.
   *
   * @param userId - The identifier of the user
   * @param cartId - The identifier of the cart
   * @param cartEntry - The entry to be updated
   */
  abstract updateCartEntry(
    userId: string,
    cartId: string,
    cartEntry: TmaOrderEntry
  )

  /**
   * Returns cart entry for provided entry number
   *
   * @param cartId - The identifier of the cart
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as an {@link Observable}
   */
  abstract getEntryForEntryNumber(cartId: string, entryNumber: number): Observable<TmaOrderEntry | null>

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param cartId - The identifier of the cart
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  abstract getSpoWithHighestEntryNumber(cartId: string, productCode: string): Observable<TmaOrderEntry | null>
}
