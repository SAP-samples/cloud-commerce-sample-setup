/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Observable } from 'rxjs';
import { Tmf } from '../../../tmf';

export abstract class TmaOrderHistoryAdapter {
  /**
   * Abstract method used to load order data.
   *
   * @param userId The `userId` for given user
   * @param baseSiteId
   * @param orderCode The `orderCode` for given order
   */
  abstract load(userId: string, baseSiteId: string, orderCode: string): Observable<Tmf.TmfProductOrderDetails>;

}
