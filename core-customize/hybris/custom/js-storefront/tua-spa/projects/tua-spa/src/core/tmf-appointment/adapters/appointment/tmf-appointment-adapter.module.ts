// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppointmentAdapter } from '../../../appointment/store';
import { TmfAppointmentAdapter } from './tmf-appointment.adapter';
import { defaultTmfAppointmentAdapterConfig } from './default-tmf-appointment-adapter-config';
import { APPOINTMENT_NORMALIZER } from '../../../appointment/connectors';
import { TmfAppointmentNormalizer } from './converters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfAppointmentAdapterConfig),
  ],
  providers: [
    {
      provide: AppointmentAdapter,
      useClass: TmfAppointmentAdapter,
    },
    {
      provide: APPOINTMENT_NORMALIZER,
      useExisting: TmfAppointmentNormalizer,
      multi: true,
    },
  ],
})
export class TmfAppointmentAdapterModule {}
