// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthConfig, ConverterService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaPremiseDetail, TmaTechnicalResource } from '../../../model';
import { TMA_TECHNICAL_RESOURCE_NORMALIZER, TmaPremiseDetailAdapter } from '../../../premisedetail';
import { PremiseLookupEndpointsService } from '../../services';
import { PremiseLookup } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class TmaPremiseLookupPremiseDetailAdapter implements TmaPremiseDetailAdapter {

  constructor(
    protected http: HttpClient,
    protected config: AuthConfig,
    protected premiseLookupEnpointsService: PremiseLookupEndpointsService,
    protected converterService: ConverterService
  ) {
  }

  /**
   * Validates the premise details
   *
   * @param premiseDetail - The details about the premise
   * @return List of {@link TmaTechnicalResource} as an {@link Observable}
   */
  validatePremiseDetail(premiseDetail: TmaPremiseDetail
  ): Observable<TmaTechnicalResource[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const url: string = this.premiseLookupEnpointsService.getUrl('premiselookup');
    const body: PremiseLookup.TmaPremiseDetails =
      {
        premiseAddress: {
          streetDetail: {
            name: premiseDetail.installationAddress.streetName,
            number: premiseDetail.installationAddress.buildingNumber,
            suite: premiseDetail.installationAddress.apartmentNumber
          },
          townDetail: {
            code: premiseDetail.installationAddress.postalCode,
            country: premiseDetail.installationAddress.country.isocode,
            name: premiseDetail.installationAddress.city,
            regionCode: premiseDetail.installationAddress.region && premiseDetail.installationAddress.region.isocode ?
              premiseDetail.installationAddress.region.isocode : ''
          }
        },
        serialNumber: premiseDetail.technicalDetails.id,
        division: premiseDetail.technicalDetails.type
      };
    return this.http.post<TmaTechnicalResource[]>(url, body, { headers })
      .pipe(this.converterService.pipeableMany(TMA_TECHNICAL_RESOURCE_NORMALIZER));
  }
}
