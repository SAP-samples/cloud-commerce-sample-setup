// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConverterService } from '@spartacus/core';
import { SearchTimeSlotAdapter } from '../../../search-time-slot/store';
import { SEARCH_TIME_SLOT_NORMALIZER } from '../../../search-time-slot/connectors';
import { SearchTimeSlot } from '../../../model';
import { TmfAppointmentEndpointsService } from '../../services';
import { TmfAppointmentApiModel } from '../../tmf-appointment-models';

@Injectable({
  providedIn: 'root',
})
export class TmfSearchTimeSlotAdapter implements SearchTimeSlotAdapter {
  constructor(
    protected http: HttpClient,
    protected tmfAppointmentEndpointsService: TmfAppointmentEndpointsService,
    protected converterService: ConverterService
  ) {}

  getTimeSlots(searchTimeSlot: SearchTimeSlot): Observable<SearchTimeSlot> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const url: string = this.tmfAppointmentEndpointsService.getUrl(
      'searchTimeSlot'
    );

    return this.http
      .post<TmfAppointmentApiModel.TmfSearchTimeSlot>(url, searchTimeSlot, { headers })
      .pipe(this.converterService.pipeable(SEARCH_TIME_SLOT_NORMALIZER));
  }
}
