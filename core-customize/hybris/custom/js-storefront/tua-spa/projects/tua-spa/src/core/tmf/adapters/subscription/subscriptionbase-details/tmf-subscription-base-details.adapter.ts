// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../../services';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../../tmf-models';
import { SubscriptionBaseDetailsAdapter } from '../../../../subscription/subscriptionbase-details/store/adapters';
import { SUBSCRIPTION_BASE_DETAIL_NORMALIZER } from '../../../../subscription/subscriptionbase-details/connectors';
import { SubscriptionBaseDetail } from '../../../../model';

@Injectable({
  providedIn: 'root',
})
export class TmfSubscriptionBaseDetailsAdapter
  implements SubscriptionBaseDetailsAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string
  ): Observable<SubscriptionBaseDetail[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;

    const url = this.tmfEndpointsService.getUrl(
      'getSubscriptionBase',
      { subscriberId: subscriptionBaseId },
      queryParameters
    );

    return this.http
      .get<Tmf.TmfSubscriptionBaseDetail[]>(url, { headers })
      .pipe(
        this.converterService.pipeableMany(SUBSCRIPTION_BASE_DETAIL_NORMALIZER)
      );
  }
}
