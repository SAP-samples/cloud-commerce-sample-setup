// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { TmaCartStoreModule } from './store/tma-cart-store.module';
import { TmaCartEventModule } from './event';
import { TmaActiveCartService, TmaMultiCartService } from './facade';
import { TmaActiveCartFacade, TmaMultiCartFacade } from './root';
import { ActiveCartFacade, MultiCartFacade } from '@spartacus/cart/base/root';
import { CartBaseModule } from '@spartacus/cart/base';

@NgModule({
  imports: [TmaCartStoreModule, TmaCartEventModule]
})
export class TmaCartModule extends CartBaseModule {
  static forRoot(): ModuleWithProviders<TmaCartModule> {
    return {
      ngModule: TmaCartModule,
      providers: [
        TmaActiveCartService,
        {
          provide: TmaActiveCartFacade,
          useExisting: TmaActiveCartService
        },
        {
          provide: ActiveCartFacade,
          useExisting: TmaActiveCartService
        },
        TmaMultiCartService,
        {
          provide: TmaMultiCartFacade,
          useExisting: TmaMultiCartService
        },
        {
          provide: MultiCartFacade,
          useExisting: TmaMultiCartService
        }
      ]
    };
  }
}
