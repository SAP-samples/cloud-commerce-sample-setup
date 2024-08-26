// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TmaCartEntryAdapter } from '../../../cart';
import { TmaOccCartEntryAdapter } from './tma-occ-cart-entry.adapter';
import { CartEntryAdapter, CartVoucherAdapter } from '@spartacus/cart/base/core';
import { CartBaseOccModule, OccCartNormalizer, OccCartVoucherAdapter } from '@spartacus/cart/base/occ';
import { TmaOccCartNormalizer } from './converters';

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: CartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: TmaCartEntryAdapter,
      useClass: TmaOccCartEntryAdapter
    },
    {
      provide: CartVoucherAdapter,
      useClass: OccCartVoucherAdapter
    },
    {
      provide: OccCartNormalizer,
      useClass: TmaOccCartNormalizer,
    },
  ]
})
export class TmaOccCartModule extends CartBaseOccModule {}
