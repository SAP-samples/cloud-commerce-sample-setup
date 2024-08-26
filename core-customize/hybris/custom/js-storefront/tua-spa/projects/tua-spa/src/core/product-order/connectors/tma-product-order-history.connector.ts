/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { TmaOrderHistoryAdapter } from '../store/adapters/tma-order-history.adapter';
import { Observable } from 'rxjs';
import { Tmf } from '../../tmf';


@Injectable()
export class TmaProductOrderHistoryConnector {
  constructor(protected adapter: TmaOrderHistoryAdapter) {}

  public get(userId: string, baseSiteId: string, orderCode: string): Observable<Tmf.TmfProductOrderDetails> {
    return this.adapter.load(userId, baseSiteId, orderCode);
  }
}
