// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { GlobalMessageModule, HttpErrorHandler } from '@spartacus/core';
import { TmaBadRequestHandler } from './http-interceptors';

@NgModule({
  imports: [],
  providers: []
})
export class TmaGlobalMessageModule extends GlobalMessageModule {
  static forRoot(): ModuleWithProviders<TmaGlobalMessageModule> {
    return {
      ngModule: TmaGlobalMessageModule,
      providers: [
        {
          provide: HttpErrorHandler,
          useClass: TmaBadRequestHandler,
          multi: true
        }]
    };
  }
}
