// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../../services';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../../tmf-models';
import { TmfProductAdapter } from '../../../../subscription/tmf-product/store/adapters';
import { TmfProduct } from '../../../../model';
import { TMF_PRODUCT_NORMALIZER } from '../../../../subscription/tmf-product';

@Injectable({
  providedIn: 'root',
})
export class TmfProductAdapterImpl implements TmfProductAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}
  getTmfProductDetails(
    baseSiteId: string,
    tmfProductId: string
  ): Observable<TmfProduct> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;

    const url = this.tmfEndpointsService.getUrl(
      'getProduct',
      { id: tmfProductId },
      queryParameters
    );

    return this.http
      .get<Tmf.TmfProduct>(url, { headers })
      .pipe(this.converterService.pipeable(TMF_PRODUCT_NORMALIZER));
  }
}
