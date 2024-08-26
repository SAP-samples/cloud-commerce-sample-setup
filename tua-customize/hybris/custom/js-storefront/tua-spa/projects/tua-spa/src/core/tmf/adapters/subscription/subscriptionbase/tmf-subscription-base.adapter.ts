// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionBaseAdapter } from '../../../../subscription/subscriptionbase/store/adapters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../../tmf-models';
import { SubscriptionBase } from '../../../../model';
import { SUBSCRIPTION_BASE_NORMALIZER } from '../../../../subscription/subscriptionbase';
import { TmfEndpointsService } from '../../../services';

@Injectable({
  providedIn: 'root',
})
export class TmfSubscriptionBaseAdapter implements SubscriptionBaseAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getListOfSubscriptionBase(
    baseSiteId: string,
    userId: string
  ): Observable<SubscriptionBase[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['subscriptionAccess.relatedParty.id'] = userId;

    const url = this.tmfEndpointsService.getUrl(
      'getSubscriptionBases',
      [],
      queryParameters
    );

    return this.http
      .get<Tmf.TmfSubscriptionBase[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(SUBSCRIPTION_BASE_NORMALIZER));
  }
}
