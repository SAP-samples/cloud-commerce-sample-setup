// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeaturesConfigModule, I18nModule, provideConfig } from '@spartacus/core';
import { TmaCheckoutPaymentMethodComponent } from './tma-checkout-payment-method.component';
import { CheckoutPaymentFormModule, CheckoutPaymentMethodModule } from '@spartacus/checkout/base/components';
import { RouterModule } from '@angular/router';
import { SpinnerModule } from '@spartacus/storefront';
import { TmaCheckoutCardModule } from '../../../shared/components/card/tma-checkout-card.module';
import { TmaCheckoutBillingFormModule } from './checkout-billing-form/tma-checkout-billing-form.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    TmaCheckoutCardModule,
    CheckoutPaymentFormModule,
    SpinnerModule,
    TmaCheckoutBillingFormModule,
    FeaturesConfigModule
  ],
  providers: [
    provideConfig(
      {
        cmsComponents: {
          CheckoutPaymentDetails: {
            component: TmaCheckoutPaymentMethodComponent
          }
        }
      }
    )],
  declarations: [TmaCheckoutPaymentMethodComponent],
  exports: [TmaCheckoutPaymentMethodComponent]
})
export class TmaCheckoutPaymentMethodModule extends CheckoutPaymentMethodModule {
}
