// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { TmaProductSpecificationForViewDetailsConfig } from './config';
import {
  defaultTmaProductSpecificationForViewDetailsConfig
} from './config/default-tma-product-specification-for-view-details-config';

@NgModule()
export class TmaProductSpecificationForViewDetailsConfigModule {
  static forRoot(): ModuleWithProviders<TmaProductSpecificationForViewDetailsConfigModule> {
    return {
      ngModule: TmaProductSpecificationForViewDetailsConfigModule,
      providers: [
        { provide: TmaProductSpecificationForViewDetailsConfig, useExisting: Config },
        provideConfig(defaultTmaProductSpecificationForViewDetailsConfig)
      ]
    };
  }
}
