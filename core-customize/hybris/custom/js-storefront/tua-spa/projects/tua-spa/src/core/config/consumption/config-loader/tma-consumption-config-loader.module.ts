// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CONFIG_INITIALIZER, ConfigInitializer } from '@spartacus/core';
import { TmaConsumptionConfig } from '../config';
import { TmaConsumptionConfigLoaderService } from './tma-consumption-config-loader.service';

@NgModule()
export class TmaConsumptionConfigLoaderModule {
  static forRoot(): ModuleWithProviders<TmaConsumptionConfigLoaderModule> {
    return {
      ngModule: TmaConsumptionConfigLoaderModule,
      providers: [
        {
          provide: CONFIG_INITIALIZER,
          useFactory: initConfig,
          deps: [TmaConsumptionConfigLoaderService, TmaConsumptionConfig],
          multi: true
        }
      ]
    };
  }
}

/**
 * Initializes the Spartacus config asynchronously basing on the external config
 */
export function initConfig(
  configLoader: TmaConsumptionConfigLoaderService,
  config: TmaConsumptionConfig
): ConfigInitializer {
  /**
   * Load config for `consumption`
   */
  if (!config || !config.consumption || !config.consumption.defaultValues || !config.consumption.default) {
    return {
      scopes: ['consumption'],
      configFactory: () => configLoader.loadConfig()
    };
  }
  return null;
}
