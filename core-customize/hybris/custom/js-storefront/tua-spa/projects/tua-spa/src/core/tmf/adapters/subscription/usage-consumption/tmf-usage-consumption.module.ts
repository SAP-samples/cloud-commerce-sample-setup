// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { USAGE_CONSUMPTION_NORMALIZER, UsageConsumptionAdapter } from '../../../../subscription';
import { TmfUsageConsumptionAdapter } from './tmf-usage-consumption.adapter';
import { defaultTmfUsageConsumptionConfig } from './default-tmf-usage-consumption-config';
import { TmfUsageConsumptionNormalizer } from './converters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,

    ConfigModule.withConfig(defaultTmfUsageConsumptionConfig),
  ],
  providers: [
    {
      provide: UsageConsumptionAdapter,
      useClass: TmfUsageConsumptionAdapter,
    },

    {
      provide: USAGE_CONSUMPTION_NORMALIZER,
      useExisting: TmfUsageConsumptionNormalizer,
      multi: true,
    },
  ],
})
export class TmfUsageConsumptionModule {}
