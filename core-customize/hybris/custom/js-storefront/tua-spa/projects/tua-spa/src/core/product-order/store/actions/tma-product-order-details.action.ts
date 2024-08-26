/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { StateUtils } from '@spartacus/core';
import { ORDER_DETAILS } from '@spartacus/order/core';
import { LoadOrderDetailsFail, LoadOrderDetailsSuccess } from '@spartacus/order/core/store/actions/order-details.action';

export const LOAD_ORDER_DETAILS = '[TmaProductOrder] Load Order Details';


export class LoadOrderDetails extends StateUtils.LoaderLoadAction {
  readonly type = LOAD_ORDER_DETAILS;
  constructor(
    public payload: {
      userId: string;
      baseSiteId: string;
      orderCode: string;
    }
  ) {
    super(ORDER_DETAILS);
  }
}

export type TmaProductOrderDetailsAction =
  | LoadOrderDetails
  | LoadOrderDetailsFail
  | LoadOrderDetailsSuccess
