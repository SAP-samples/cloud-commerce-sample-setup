// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaProductStoreModule } from './store/tma-product-store.module';

@NgModule({
  imports: [TmaProductStoreModule]
})
export class TmaProductModule {
  static forRoot(): ModuleWithProviders<TmaProductModule> {
    return {
      ngModule: TmaProductModule,
      providers: []
    };
  }
}
