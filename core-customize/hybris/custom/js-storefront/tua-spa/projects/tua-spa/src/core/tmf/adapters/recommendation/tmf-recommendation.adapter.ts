// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Recommendation } from '../../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../services/tmf-endpoints.service';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../tmf-models/tmf.models';
import { RECOMMENDATION_NORMALIZER, RecommendationAdapter } from '../../../recommendation';

@Injectable({
  providedIn: 'root'
})
export class TmfRecommendationAdapter implements RecommendationAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getRecommendations(
    baseSiteId: string,
    relatedPartyId: string,
    processTypeId: string,
    relatedProductOfferingId: string,
    subscriptionBaseId: string
  ): Observable<Recommendation[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['relatedParty.id'] = relatedPartyId;
    queryParameters['processType.id'] = processTypeId;
    queryParameters['relatedProductOffering.id'] = relatedProductOfferingId;
    queryParameters['subscriptionBase.id'] = subscriptionBaseId;

    const url = this.tmfEndpointsService.getUrl(
      'getRecommendations',
      [],
      queryParameters
    );

    return this.http
      .get<Tmf.TmfRecommendation[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(RECOMMENDATION_NORMALIZER));
  }
}
