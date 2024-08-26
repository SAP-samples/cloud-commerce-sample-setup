// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { Config, provideConfig, provideConfigValidator } from '@spartacus/core';
import { TmaClientTokenInterceptor, TmaUserTokenInterceptor } from '../auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { defaultTmfAppointmentConfig, TmfAppointmentConfig, tmfAppointmentConfigValidator } from './config';
import { TmfAppointmentAdapterModule, TmfSearchTimeSlotAdapterModule } from './adapters';

@NgModule({
  imports: [TmfAppointmentAdapterModule, TmfSearchTimeSlotAdapterModule],
})
export class TmfAppointmentModule {
  static forRoot(): ModuleWithProviders<TmfAppointmentModule> {
    return {
      ngModule: TmfAppointmentModule,
      providers: [
        { provide: TmfAppointmentConfig, useExisting: Config },

        provideConfig(defaultTmfAppointmentConfig),
        provideConfigValidator(tmfAppointmentConfigValidator),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaClientTokenInterceptor,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TmaUserTokenInterceptor,
          multi: true,
        },
      ],
    };
  }
}
