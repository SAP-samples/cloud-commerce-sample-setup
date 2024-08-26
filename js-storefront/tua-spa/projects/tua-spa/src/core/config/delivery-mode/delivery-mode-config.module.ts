// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig } from '@spartacus/core';
import { defaultDeliveryModeConfig, DeliveryModeConfig } from './config';

@NgModule({})
export class DeliveryModeConfigModule {
  static forRoot(): ModuleWithProviders<DeliveryModeConfigModule> {
    return {
      ngModule: DeliveryModeConfigModule,
      providers: [
        { provide: DeliveryModeConfig, useExisting: Config },
        provideConfig(defaultDeliveryModeConfig)
      ]
    };
  }
}
