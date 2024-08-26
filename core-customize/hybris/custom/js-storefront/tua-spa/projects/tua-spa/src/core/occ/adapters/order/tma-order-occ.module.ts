// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TMA_ORDER_NORMALIZER } from '../../../checkout';
import { TmaOccOrderNormalizer } from './converters';
import { TmaOccOrderAdapter, TmaOccOrderHistoryAdapter } from './adapters';
import { OrderAdapter, OrderHistoryAdapter } from '@spartacus/order/core';
import { OrderOccModule } from '@spartacus/order/occ';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [
    {
      provide: OrderHistoryAdapter,
      useClass: TmaOccOrderHistoryAdapter
    },
    {
      provide: OrderAdapter,
      useClass: TmaOccOrderAdapter
    },
    {
      provide: TMA_ORDER_NORMALIZER,
      useExisting: TmaOccOrderNormalizer,
      multi: true
    }
  ]
})
export class TmaOrderOccModule extends OrderOccModule { }
