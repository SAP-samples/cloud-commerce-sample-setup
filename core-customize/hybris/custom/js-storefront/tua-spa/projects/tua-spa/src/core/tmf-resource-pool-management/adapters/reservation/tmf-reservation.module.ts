// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '@spartacus/core';
import { defaultTmfReservationConfig } from './default-tmf-reservation-config';
import { TmfReservationAdapter } from './tmf-reservation.adapter';
import { TmfReservationNormalizer } from './converters';
import { ReservationAdapter } from '../../../reservation/store';
import { RESERVATION_NORMALIZER } from '../../../reservation';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfReservationConfig)
  ],
  providers: [
    {
      provide: ReservationAdapter,
      useClass: TmfReservationAdapter
    },
    {
      provide: RESERVATION_NORMALIZER,
      useExisting: TmfReservationNormalizer,
      multi: true
    }
  ]
})
export class TmfReservationModule {
}
