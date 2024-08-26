// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { AVAILABILITY_CHECK_NORMALIZER } from '../../../availability-check';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '@spartacus/core';
import { TmfAvailabilityCheckAdapter } from './tmf-availability-check-adapter';
import { TmfAvailabilityCheckNormalizer } from './converters';
import { defaultTmfAvailabilityCheckConfig } from './default-tmf-availability-check-config';
import { AvailabilityCheckAdapter } from '../../../availability-check/store';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfAvailabilityCheckConfig)
  ],
  providers: [
    {
      provide: AvailabilityCheckAdapter,
      useClass: TmfAvailabilityCheckAdapter
    },
    {
      provide: AVAILABILITY_CHECK_NORMALIZER,
      useExisting: TmfAvailabilityCheckNormalizer,
      multi: true
    }
  ]
})
export class TmfAvailabilityCheckModule {
}
