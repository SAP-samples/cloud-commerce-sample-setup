// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmfProductStoreModule } from './store/tmf-product.store.module';
import { TmfProductService } from './facade';

@NgModule({
  imports: [TmfProductStoreModule],
})
export class TmfProductModule {
  static forRoot(): ModuleWithProviders<TmfProductModule> {
    return {
      ngModule: TmfProductModule,
      providers: [TmfProductService],
    };
  }
}
