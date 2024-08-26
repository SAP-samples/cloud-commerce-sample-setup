// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  AuthConfig,
  AuthModule,
  AuthService,
  AuthStatePersistenceService,
  ClientAuthModule,
  Config,
  ConfigModule,
  UserAuthModule,
  UserIdService
} from '@spartacus/core';
import { defaultTmaAuthConfig } from './config/default-tma-auth-config';
import { TmaClientTokenInterceptor, TmaUserTokenInterceptor } from './http-interceptors';
import { TmaAuthService } from './facade/tma-auth.service';
import { TmaUserIdService } from '../user/facade/tma-user-id.service';
import { TmaAuthStatePersistenceService } from './facade/tma-auth-state-persistence.service';

@NgModule({
  imports: [
    CommonModule,
    ClientAuthModule.forRoot(),
    UserAuthModule.forRoot(),
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaAuthConfig)
  ]
})
export class TmaAuthModule extends AuthModule {
  static forRoot(): ModuleWithProviders<TmaAuthModule> {
    return {
      ngModule: TmaAuthModule,
      providers: [
        ...[
          {
            provide: HTTP_INTERCEPTORS,
            useExisting: TmaClientTokenInterceptor,
            multi: true
          },
          {
            provide: HTTP_INTERCEPTORS,
            useExisting: TmaUserTokenInterceptor,
            multi: true
          }
        ],
        { provide: AuthConfig, useExisting: Config },
        { provide: AuthService, useExisting: TmaAuthService },
        { provide: UserIdService, useExisting: TmaUserIdService },
        { provide: AuthStatePersistenceService, useExisting: TmaAuthStatePersistenceService }
      ]
    };
  }
}
