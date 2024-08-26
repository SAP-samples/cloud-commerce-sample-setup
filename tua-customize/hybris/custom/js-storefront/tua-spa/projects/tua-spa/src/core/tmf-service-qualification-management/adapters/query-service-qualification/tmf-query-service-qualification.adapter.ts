// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConverterService } from '@spartacus/core';
import { TmfQueryServiceQualificationEndpointsService } from '../../services';
import { QueryServiceQualification } from '../../../model';
import { TmfQueryServiceQualificationApiModel } from '../../tmf-query-service-qualification-models';
import { QUERY_SERVICE_QUALIFICATION_NORMALIZER, QueryServiceQualificationAdapter } from '../../../queryServiceQualification';

@Injectable({
  providedIn: 'root'
})
export class TmfQueryServiceQualificationAdapter
  implements QueryServiceQualificationAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfQueryServiceQualificationEndpointsService,
    protected converter: ConverterService
  ) {}

  createQueryServiceQualification(
    queryServiceQualification: QueryServiceQualification
  ): Observable<QueryServiceQualification> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url: string = this.tmfEndpointsService.getUrl(
      'queryServiceQualification'
    );
    return this.http
      .post<TmfQueryServiceQualificationApiModel.TmfQueryServiceQualification>(
        url,
        queryServiceQualification,
        { headers }
      )
      .pipe(this.converter.pipeable(QUERY_SERVICE_QUALIFICATION_NORMALIZER));
  }
}
