// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { TmaPremiseLookupPremiseDetailModule } from './adapters';
import { defaultPremiseLookupConfig, PremiseLookupConfig } from './config';

@NgModule({
  imports: [
    TmaPremiseLookupPremiseDetailModule
  ]
})
export class PremiseLookupModule {
  static forRoot(): ModuleWithProviders<PremiseLookupModule> {
    return {
      ngModule: PremiseLookupModule,
      providers: [
        { provide: PremiseLookupConfig, useExisting: Config },
        provideConfig(defaultPremiseLookupConfig)
      ]
    };
  }
}
