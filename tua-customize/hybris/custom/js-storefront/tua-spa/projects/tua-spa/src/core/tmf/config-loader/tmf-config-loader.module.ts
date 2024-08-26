// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { BASE_SITE_CONTEXT_ID, CONFIG_INITIALIZER, ConfigInitializer, SiteContextConfig } from '@spartacus/core';
import { TmfConfigLoaderService } from './tmf-config-loader.service';

/**
 * Re-provides the external config chunk given before Angular bootstrap
 */
@NgModule()
export class TmfConfigLoaderModule {
  static forRoot(): ModuleWithProviders<TmfConfigLoaderModule> {
    return {
      ngModule: TmfConfigLoaderModule,
      providers: [
        {
          provide: CONFIG_INITIALIZER,
          useFactory: initConfig,
          deps: [TmfConfigLoaderService, SiteContextConfig],
          multi: true
        }
      ]
    };
  }
}

/**
 * Initializes the Spartacus config asynchronously basing on the external config
 */
export function initConfig(configLoader: TmfConfigLoaderService, config: SiteContextConfig): ConfigInitializer {
  /**
   * Load config for `context` from backend only when there is no static config for `context.baseSite`
   */
  if (!config.context || !config.context[BASE_SITE_CONTEXT_ID]) {
    return {
      scopes: ['context', 'i18n.fallbackLang'],
      configFactory: () => configLoader.loadConfig()
    };
  }
  return null;
}
