// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { TmaCartTotalsComponent } from './tma-cart-totals.component';
import { TmaCartSharedModule } from '../cart-shared';
import { CartCouponModule, CartTotalsModule } from '@spartacus/cart/base/components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CartTotalsComponent: {
          component: TmaCartTotalsComponent
        }
      }
    }),
    TmaCartSharedModule,
    I18nModule,
    CartCouponModule
  ],
  declarations: [TmaCartTotalsComponent],
  exports: [TmaCartTotalsComponent]
})
export class TmaCartTotalsModule extends CartTotalsModule { }
