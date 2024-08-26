// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaProduct } from '../../../model';
import { PRODUCT_OFFERING_NORMALIZER, ProductOfferingAdapter } from '../../../productoffering';
import { TmfEndpointsService } from '../../services';
import { Tmf } from '../../tmf-models';

@Injectable({
  providedIn: 'root'
})
export class TmfProductOfferingAdapter implements ProductOfferingAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getProductOffering(
    baseSiteId: string,
    productOfferingId: string,
    processType?: string
  ): Observable<TmaProduct[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['priceContext.processType.id'] = [processType];

    const url = this.tmfEndpointsService.getUrl(
      'getProductOffering',
      {
        id: productOfferingId
      },
      queryParameters
    );

    return this.http
      .get<Tmf.TmfProductOffering[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(PRODUCT_OFFERING_NORMALIZER));
  }
}
