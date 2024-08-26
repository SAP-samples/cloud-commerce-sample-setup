// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { TmaConsumptionConfig } from './config';
import { TmaConsumptionConfigLoaderModule } from './config-loader/index';
import { defaultTmaConsumptionConfig } from './config/default-tma-consumption-config';

@NgModule({
  imports: [
    TmaConsumptionConfigLoaderModule.forRoot()
  ]
})
export class TmaConsumptionConfigModule {
  static forRoot(): ModuleWithProviders<TmaConsumptionConfigModule> {
    return {
      ngModule: TmaConsumptionConfigModule,
      providers: [
        { provide: TmaConsumptionConfig, useExisting: Config },
        provideConfig(defaultTmaConsumptionConfig)
      ]
    };
  }
}
