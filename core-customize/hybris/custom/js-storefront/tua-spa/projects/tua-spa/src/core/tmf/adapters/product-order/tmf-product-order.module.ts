// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ConfigModule } from '@spartacus/core';
import { defaultTmfProductOrderConfig } from './default-tmf-product-order.config';
import { TmaProductOrderAdapter } from '../../../product-order/store/adapters';
import { TmfProductOrderAdapter } from './adapters/tmf-product-order.adapter';
import { TMA_PAGINATED_ORDER_NORMALIZER } from '../../../product-order/connectors';
import { TmfPaginatedOrderNormalizer } from './converters/tmf-paginated-order.normalizer';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfProductOrderConfig)
  ],
  providers: [
    {
      provide: TmaProductOrderAdapter,
      useClass: TmfProductOrderAdapter
    },
    {
      provide: TMA_PAGINATED_ORDER_NORMALIZER,
      useExisting: TmfPaginatedOrderNormalizer,
      multi: true
    }
  ]
})
export class TmfProductOrderModule {
}
