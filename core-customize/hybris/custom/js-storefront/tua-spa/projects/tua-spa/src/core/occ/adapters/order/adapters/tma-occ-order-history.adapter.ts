// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ConverterService,
  InterceptorUtil,
  Occ,
  OCC_USER_ID_ANONYMOUS,
  OccEndpointsService,
  USE_CLIENT_TOKEN
} from '@spartacus/core';
import { TMA_ORDER_NORMALIZER } from '../../../../checkout';
import { OccOrderHistoryAdapter } from '@spartacus/order/occ';
import { OrderHistoryAdapter } from '@spartacus/order/core';
import { Order } from '@spartacus/order/root';

@Injectable()
export class TmaOccOrderHistoryAdapter
  extends OccOrderHistoryAdapter
  implements OrderHistoryAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }

   /**
    * Retrieves an order for a given order id of the user.
    *
    * @param userId The identifier of the user
    * @param orderCode The identifier of the order
    * @return The order as {@link Observable} of {@link Order}
    */
  public load(userId: string, orderCode: string): Observable<Order> {
     const url = this.occEndpoints.buildUrl('orderDetail', {
       urlParams: {
         userId,
         orderId: orderCode
       }
     });

    let headers = new HttpHeaders();
    if (userId === OCC_USER_ID_ANONYMOUS) {
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }
    return this.http
      .get<Occ.Order>(url, { headers })
      .pipe(this.converter.pipeable(TMA_ORDER_NORMALIZER));
  }
}
