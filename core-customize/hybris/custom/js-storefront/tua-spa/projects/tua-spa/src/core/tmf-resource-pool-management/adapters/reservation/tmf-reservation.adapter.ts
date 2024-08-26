// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService, OCC_USER_ID_ANONYMOUS } from '@spartacus/core';
import { ReservationAdapter } from '../../../reservation/store/adapters';
import { TmfLogicalResource } from '../../tmf-resource-pool-management-models';
import { TmfResourcePoolManagementEndpointsService } from '../../services';
import { RESERVATION_NORMALIZER } from '../../../reservation';
import { Reservation } from '../../../model';
import { LOCAL_STORAGE } from '../../../util/constants';

const { APPLICATION_JSON } = LOCAL_STORAGE.AT_TYPES;

@Injectable({
  providedIn: 'root'
})
export class TmfReservationAdapter implements ReservationAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfEndpointsService: TmfResourcePoolManagementEndpointsService,
    protected converterService: ConverterService
  ) {
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    const headers = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    const url = this.tmfEndpointsService.getUrl('postReservation');
    return this.http
      .post<TmfLogicalResource.TmfReservation[]>(url, reservation, {
        headers
      })
      .pipe(this.converterService.pipeable(RESERVATION_NORMALIZER));
  }

  updateReservation(
    updateReservation: Reservation,
    reservationId: string
  ): Observable<Reservation> {
    const headers = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    const url = this.tmfEndpointsService.getUrl('updateReservation', {
      id: reservationId
    });
    return this.http
      .patch<TmfLogicalResource.TmfReservation[]>(url, updateReservation, {
        headers
      })
      .pipe(this.converterService.pipeable(RESERVATION_NORMALIZER));
  }

  getReservationsByUserId(
    userId: string,
    cartEntryResourceValues: string[]
  ): Observable<Reservation[]> {
    const headers = new HttpHeaders({
      'Content-Type': [APPLICATION_JSON]
    });
    if (userId === undefined) {
      userId = OCC_USER_ID_ANONYMOUS;
    }
    const queryParameters = {};
    queryParameters['relatedParty.id'] = userId;

    queryParameters[
      'reservationItem.appliedCapacityAmount.resource.value'
      ] = cartEntryResourceValues;
    const url = this.tmfEndpointsService.getUrl(
      'getReservationById',
      [],
      queryParameters
    );
    return this.http
      .get<TmfLogicalResource.TmfReservation[]>(url, { headers })
      .pipe(this.converterService.pipeableMany(RESERVATION_NORMALIZER));
  }
}
