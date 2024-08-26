// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService, InterceptorUtil, RoutingService, USE_CLIENT_TOKEN } from '@spartacus/core';
import { Observable } from 'rxjs';
import {
  TmaBillingAccounts,
  TmaBillingAgreements,
  TmaCustomerBills,
  TmaSubscribedProductsInventory,
  TmaSubscriptions
} from '../../../model';
import {
  BILLING_ACCOUNTS_NORMALIZER,
  BILLING_AGREEMENTS_NORMALIZER,
  CUSTOMER_BILLS_NORMALIZER,
  SelfcareAdapter,
  SUBSCRIBED_PRODUCT_NORMALIZER,
  SUBSCRIPTIONS_NORMALIZER
} from '../../../selfcare';
import { TmfEndpointsService } from '../../services';
import { Tmf } from '../../tmf-models';
import { LOCAL_STORAGE } from '../../../util/constants';

const { APPLICATION_JSON } = LOCAL_STORAGE.AT_TYPES;

@Injectable({
  providedIn: 'root'
})
export class TmfSelfcareAdapter implements SelfcareAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService,
    protected routingService: RoutingService
  ) {}

  getSubscriptions(): Observable<TmaSubscribedProductsInventory> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getSubscriptions', {});

    return this.http
      .get<Tmf.TmfSubscribedProductsInventory>(url, { headers })
      .pipe(this.converterService.pipeable(SUBSCRIPTIONS_NORMALIZER));
  }

  getSubscribedProduct(productId: string): Observable<TmaSubscriptions> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getSubscriptions', {});

    return this.http
      .get<Tmf.TmfSubscriptions>(`${url}/${productId}`, { headers })
      .pipe(this.converterService.pipeable(SUBSCRIBED_PRODUCT_NORMALIZER));
  }

  getBillingAccounts(): Observable<TmaBillingAccounts[]> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getBillingAccounts', {});

    return this.http
      .get<Tmf.TmfBillingAccounts[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(BILLING_ACCOUNTS_NORMALIZER));
  }

  getBillingAgreements(): Observable<TmaBillingAgreements[]> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getBillingAgreements', {});

    return this.http
      .get<Tmf.TmfBillingAgreements[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(BILLING_AGREEMENTS_NORMALIZER));
  }

  getCustomerBills(): Observable<TmaCustomerBills[]> {
    let headers: HttpHeaders = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    headers = InterceptorUtil.createHeader(USE_CLIENT_TOKEN, true, headers);

    const url = this.tmfEndpointsService.getUrl('getCustomerBills', {});

    return this.http
      .get<Tmf.TmfCustomerBills[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(CUSTOMER_BILLS_NORMALIZER));
  }
}
