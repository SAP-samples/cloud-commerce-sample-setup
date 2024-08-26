/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { CheckoutState } from '@spartacus/checkout/base/root';
import { CheckoutQueryService } from '@spartacus/checkout/base/core';
import { Observable } from 'rxjs';


@Injectable()
export class TmaCheckoutQueryService extends CheckoutQueryService {
  getCheckoutDetailsStateForCart(cartId: string, userId: string): Observable<CheckoutState | undefined> {
    return this.checkoutConnector.getCheckoutDetails(userId, cartId);
  }
}
