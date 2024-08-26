// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { AtMessageModule, SpinnerComponent } from '@spartacus/storefront';
import { TmaPlaceOrderComponent } from './tma-place-order.component';
import { CartNotEmptyGuard, CheckoutAuthGuard, CheckoutPlaceOrderModule } from '@spartacus/checkout/base/components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    I18nModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutPlaceOrder: {
          component: TmaPlaceOrderComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard]
        }
      }
    }),
    AtMessageModule,
    ReactiveFormsModule
  ],
  declarations: [TmaPlaceOrderComponent],
  exports: [TmaPlaceOrderComponent],
})
export class TmaPlaceOrderModule extends CheckoutPlaceOrderModule { }
