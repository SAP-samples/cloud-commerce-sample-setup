// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaChecklistAction, TmaProcessTypeEnum } from '../../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaChecklistActionAdapter } from '../../../checklistaction/store/adapters';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TmfEndpointsService } from '../../services';
import { ConverterService } from '@spartacus/core';
import { Tmf } from '../../tmf-models';
import { TMA_CHECKLIST_ACTION_NORMALIZER } from '../../../checklistaction/connectors';

@Injectable({
  providedIn: 'root',
})
export class TmaTmfChecklistActionAdapter implements TmaChecklistActionAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfEndpointsService,
    protected converterService: ConverterService
  ) {}

  getChecklistActions(
    baseSiteId: string,
    productId: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['processType.id'] = TmaProcessTypeEnum[processType];
    queryParameters['productOffering.id'] = productId;

    const url = this.tmfEndpointsService.getUrl(
      'getChecklistAction',
      [],
      queryParameters
    );

    return this.http
      .get<Tmf.TmaChecklistAction[]>(url, { headers })
      .pipe(
        this.converterService.pipeableMany(TMA_CHECKLIST_ACTION_NORMALIZER)
      );
  }

  getChecklistActionsFor(
    baseSiteId: string,
    productOfferingIds: string[],
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const queryParameters = {};
    queryParameters['baseSiteId'] = baseSiteId;
    queryParameters['processType.id'] = TmaProcessTypeEnum[processType];
    queryParameters['productOffering.id'] = productOfferingIds;

    const url = this.tmfEndpointsService.getUrl(
      'getChecklistAction',
      [],
      queryParameters
    );

    return this.http
      .get<Tmf.TmaChecklistAction[][]>(url, { headers })
      .pipe(
        this.converterService.pipeableMany(TMA_CHECKLIST_ACTION_NORMALIZER)
      );
  }
}
