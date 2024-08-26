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
import { Order } from '@spartacus/order/root';
import { OrderAdapter } from '@spartacus/order/core';
import { OccOrderAdapter } from '@spartacus/order/occ';

@Injectable()
export class TmaOccOrderAdapter
  extends OccOrderAdapter
  implements OrderAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }

   /**
    * Places an order for a given cart of the user.
    *
    * @param userId The identifier of the user
    * @param cartId The identifier of the cart
    * @param termsChecked The identifier of the termsChecked
    * @return The order as {@link Observable} of {@link Order}
    */
  public placeOrder(userId: string, cartId: string, termsChecked: boolean): Observable<Order> {
    const url = this.getPlaceOrderEndpoint(userId, cartId, termsChecked.toString());

    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    if (userId === OCC_USER_ID_ANONYMOUS) {
      headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);
    }

    return this.http
      .post<Occ.Order>(url, {}, { headers })
      .pipe(this.converter.pipeable(TMA_ORDER_NORMALIZER));
  }
}
