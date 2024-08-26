// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { CardModule, IconModule, OutletModule, PromotionsModule } from '@spartacus/storefront';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { TmaReviewSubmitComponent } from './tma-review-submit.component';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';

@NgModule({
  imports: [
    CommonModule,
    CardModule,
    TmaCartSharedModule,
    I18nModule,
    UrlModule,
    RouterModule,
    PromotionsModule,
    IconModule,
    OutletModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        CheckoutReviewOrder: {
          component: TmaReviewSubmitComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [TmaReviewSubmitComponent],
  exports: [TmaReviewSubmitComponent],
})
export class TmaReviewSubmitModule { }
