// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '@spartacus/core';
import { TmaTmfCartAdapter } from '../../../tmf-cart/store/adapters';
import { defaultTmaTmfCartConfig } from './default-tma-tmf-cart-config';
import { TmaTmfShoppingCartAdapter } from './tma-tmf-shopping-cart.adapter';
import { TMA_TMF_CART_NORMALIZER } from '../../../tmf-cart/connectors/converters';
import { TmaTmfCartNormalizer } from './converters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaTmfCartConfig)
  ],
  providers: [
    {
      provide: TmaTmfCartAdapter,
      useClass: TmaTmfShoppingCartAdapter
    },
    {
      provide: TMA_TMF_CART_NORMALIZER,
      useExisting: TmaTmfCartNormalizer,
      multi: true
    }
  ]
})
export class TmaTmfShoppingCartModule { }
