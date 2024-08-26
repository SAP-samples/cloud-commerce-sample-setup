// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaTmfCartAdapter } from '../../../tmf-cart/store/adapters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../services';
import { ConverterService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { Tmf } from '../../tmf-models';
import { TmaTmfShoppingCart } from '../../../model';
import { TMA_TMF_CART_NORMALIZER } from '../../../tmf-cart/connectors/converters';

@Injectable({
  providedIn: 'root'
})
export class TmaTmfShoppingCartAdapter implements TmaTmfCartAdapter {

  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {
  }


  updateCart(shoppingCart: TmaTmfShoppingCart): Observable<TmaTmfShoppingCart> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = shoppingCart.baseSiteId;

    const url = this.tmfEndpointsService.getUrl('updateShoppingCart', { id: shoppingCart.id }, queryParameters);

    return this.http
      .patch<Tmf.TmaTmfShoppingCart>(url, shoppingCart, { headers })
      .pipe(this.converterService.pipeable(TMA_TMF_CART_NORMALIZER));
  }
}
