// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { TmaCheckoutOrderSummaryComponent } from './tma-checkout-order-summary.component';
import { CheckoutOrderSummaryModule } from '@spartacus/checkout/base/components';

@NgModule({
  imports: [
    CommonModule,
    TmaCartSharedModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CheckoutOrderSummary: {
          component: TmaCheckoutOrderSummaryComponent
        }
      }
    })
  ],
  declarations: [TmaCheckoutOrderSummaryComponent],
  exports: [TmaCheckoutOrderSummaryComponent]
})
export class TmaCheckoutOrderSummaryModule extends CheckoutOrderSummaryModule { }
