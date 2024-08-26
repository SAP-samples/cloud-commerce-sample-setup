// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaBillingFrequencyConfigLoaderModule } from './config-loader/tma-billing-frequency-config-loader.module';
import { TmaBillingFrequencyConfig } from './config';
import { Config, provideConfig } from '@spartacus/core';
import { defaultTmaBillingFrequencyConfig } from './config/default-tma-billing-frequency-config';

@NgModule({
  imports: [
    TmaBillingFrequencyConfigLoaderModule.forRoot()
  ],
})
export class TmaBillingFrequencyConfigModule {
  static forRoot(): ModuleWithProviders<TmaBillingFrequencyConfigModule> {
    return {
      ngModule: TmaBillingFrequencyConfigModule,
      providers: [
        { provide: TmaBillingFrequencyConfig, useExisting: Config },
        provideConfig(defaultTmaBillingFrequencyConfig)
      ]
    };
  }
}
