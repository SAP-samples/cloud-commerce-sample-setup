/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { ActiveCartFacade, CART_BASE_CORE_FEATURE } from '@spartacus/cart/base/root';
import { facadeFactory } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaOrderEntry } from '../../../model';

@Injectable({
  providedIn: 'root',
  useFactory: () =>
    facadeFactory({
      facade: TmaActiveCartFacade,
      feature: CART_BASE_CORE_FEATURE,
      methods: [
        'getEntryFor',
        'getSpoWithHighestEntryNumber'
      ],
      async: true,
    }),
})
export abstract class TmaActiveCartFacade extends ActiveCartFacade {

  /**
   * Returns cart entry for provided entry number
   *
   * @param entryNumber - The number of the entry
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  abstract getEntryFor(entryNumber: number): Observable<TmaOrderEntry>;

  /**
   * Returns the SPO cart entry which has the highest entry number for the provided product code
   *
   * @param productCode - The identifier of the product
   * @return A {@link TmaOrderEntry} as a {@link Observable}
   */
  abstract getSpoWithHighestEntryNumber(productCode: string): Observable<TmaOrderEntry>

}
