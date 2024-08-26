// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaAddToCartStoreModule } from './store';
import { TmaAddToCartService } from './facade';

@NgModule({
  imports: [TmaAddToCartStoreModule]
})
export class  TmaBuildAddToCartModule {
  static forRoot(): ModuleWithProviders<TmaBuildAddToCartModule> {
    return {
      ngModule: TmaBuildAddToCartModule,
      providers: [TmaAddToCartService],
    };
  }
}
