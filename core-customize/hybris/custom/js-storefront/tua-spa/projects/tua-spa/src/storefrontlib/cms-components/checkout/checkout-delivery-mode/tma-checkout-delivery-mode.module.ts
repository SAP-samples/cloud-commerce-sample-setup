// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsConfig, I18nModule, provideConfig, provideDefaultConfig } from '@spartacus/core';
import {
  OutletModule,
  PageComponentModule,
  SpinnerModule,
} from '@spartacus/storefront';
import { TmaCheckoutDeliveryModeComponent } from './tma-checkout-delivery-mode.component';
import { CartNotEmptyGuard, CheckoutAuthGuard, CheckoutDeliveryModeModule } from '@spartacus/checkout/base/components';
import { TmaCheckoutCardModule } from '../../../shared/components/card/tma-checkout-card.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    TmaCheckoutCardModule,
    SpinnerModule,
    OutletModule,
    PageComponentModule,
  ],
  providers: [
    provideConfig({
      cmsComponents: {
        CheckoutDeliveryMode: {
          component: TmaCheckoutDeliveryModeComponent,
          data: {
            composition: {
              inner: ['PickupInStoreDeliveryModeComponent'],
            },
          },
          guards: [CheckoutAuthGuard, CartNotEmptyGuard],
        },
      },
    }),
  ],
  declarations: [TmaCheckoutDeliveryModeComponent],
  exports: [TmaCheckoutDeliveryModeComponent],
})
export class TmaCheckoutDeliveryModeModule extends CheckoutDeliveryModeModule{}
