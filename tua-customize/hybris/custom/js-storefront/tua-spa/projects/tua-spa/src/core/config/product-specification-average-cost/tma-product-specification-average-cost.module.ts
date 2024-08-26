// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { TmaProductSpecificationAverageCostConfig } from './config';
import { defaultTmaProductSpecificationAverageCostConfig } from './config/default-tma-product-specification-average-cost-config';

@NgModule()
export class TmaProductSpecificationAverageCostModule {
  static forRoot(): ModuleWithProviders<TmaProductSpecificationAverageCostModule> {
    return {
      ngModule: TmaProductSpecificationAverageCostModule,
      providers: [
        { provide: TmaProductSpecificationAverageCostConfig, useExisting: Config },
        provideConfig(defaultTmaProductSpecificationAverageCostConfig)
      ]
    };
  }
}
