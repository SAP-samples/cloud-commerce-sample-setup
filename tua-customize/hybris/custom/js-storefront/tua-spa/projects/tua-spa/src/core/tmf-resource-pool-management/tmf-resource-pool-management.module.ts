// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import { TmaClientTokenInterceptor, TmaUserTokenInterceptor } from '..';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { defaultResourceTmfConfig, tmaConfigValidator, TmfResourcePoolManagementConfig } from './config';
import { TmfReservationModule } from './adapters/reservation';
import { TmfAvailabilityCheckModule } from './adapters/availability-check';

@NgModule({
  imports: [TmfAvailabilityCheckModule, TmfReservationModule]
})
export class TmfResourcePoolManagementModule {
  static forRoot(): ModuleWithProviders<TmfResourcePoolManagementModule> {
    return {
      ngModule: TmfResourcePoolManagementModule,
      providers: [
        { provide: TmfResourcePoolManagementConfig, useExisting: Config },
        provideConfig(defaultResourceTmfConfig),
        provideConfigValidator(tmaConfigValidator),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaClientTokenInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaUserTokenInterceptor,
          multi: true
        }
      ]
    };
  }
}
