// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService, InterceptorUtil, USE_CLIENT_TOKEN } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaProductOfferingQualification } from '../../../model';
import {
  PRODUCT_OFFERING_QUALIFICATION_NORMALIZER,
  ProductOfferingQualificationAdapter
} from '../../../product-offering-qualification';
import { TmfEndpointsService } from '../../services';
import { Tmf } from '../../tmf-models';

@Injectable({
  providedIn: 'root'
})
export class TmfProductOfferingQualificationAdapter implements ProductOfferingQualificationAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getProductOfferingQualification (productOfferingQualification: TmaProductOfferingQualification): Observable<TmaProductOfferingQualification> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers)

    const url = this.tmfEndpointsService.getUrl('getProductOfferingQualification');

    return this.http
      .post<Tmf.TmfProductOfferingQualification>(url, productOfferingQualification, {headers})
      .pipe(this.converterService.pipeable(PRODUCT_OFFERING_QUALIFICATION_NORMALIZER));
  }
}
