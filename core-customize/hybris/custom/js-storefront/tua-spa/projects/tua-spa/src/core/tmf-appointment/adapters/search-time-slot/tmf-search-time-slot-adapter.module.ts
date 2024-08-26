// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmfSearchTimeSlotAdapterConfig } from './default-tmf-search-time-slot-adapter-config';
import { SEARCH_TIME_SLOT_NORMALIZER } from '../../../search-time-slot/connectors/converters';
import { SearchTimeSlotAdapter } from '../../../search-time-slot/store/';
import { TmfSearchTimeSlotAdapter } from './tmf-search-time-slot.adapter';
import { TmfSearchTimeSlotNormalizer } from './converters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfSearchTimeSlotAdapterConfig),
  ],
  providers: [
    {
      provide: SearchTimeSlotAdapter,
      useClass: TmfSearchTimeSlotAdapter,
    },
    {
      provide: SEARCH_TIME_SLOT_NORMALIZER,
      useExisting: TmfSearchTimeSlotNormalizer,
      multi: true,
    },
  ],
})
export class TmfSearchTimeSlotAdapterModule {}
