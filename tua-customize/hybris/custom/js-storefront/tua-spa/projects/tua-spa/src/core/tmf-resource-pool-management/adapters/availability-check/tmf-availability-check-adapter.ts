// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AVAILABILITY_CHECK_NORMALIZER } from '../../../availability-check';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmfResourcePoolManagementEndpointsService } from '../../services';
import { AppliedCapacityAmount, ResourceCapacityDemand } from '../../../model';
import { TmfLogicalResource } from '../../tmf-resource-pool-management-models';
import { AvailabilityCheckAdapter } from '../../../availability-check/store';

@Injectable({
  providedIn: 'root'
})
export class TmfAvailabilityCheckAdapter implements AvailabilityCheckAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfResourcePoolManagementEndpointsService,
    protected converterService: ConverterService
  ) {
  }

  getLogicalResources(
    resourceCapacityDemand: ResourceCapacityDemand
  ): Observable<AppliedCapacityAmount> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = this.tmfEndpointsService.getUrl('availabilityCheck');
    return this.http
      .post<TmfLogicalResource.TmfAppliedCapacityAmount>(
        url,
        resourceCapacityDemand,
        {
          headers
        }
      )
      .pipe(this.converterService.pipeable(AVAILABILITY_CHECK_NORMALIZER));
  }
}
