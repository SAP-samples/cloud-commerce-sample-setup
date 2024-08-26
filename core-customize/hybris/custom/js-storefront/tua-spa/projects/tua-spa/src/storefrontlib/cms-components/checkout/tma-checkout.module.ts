// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PromotionsModule } from '@spartacus/storefront';
import { TmaCheckoutOrderSummaryModule } from './checkout-order-summary/tma-checkout-order-summary.module';
import { TmaReviewSubmitModule } from './review-submit/tma-review-submit.module';
import { TmaPlaceOrderModule } from './place-order/tma-place-order.module';
import {
  CheckoutComponentsModule,
  CheckoutDeliveryAddressModule,
  CheckoutOrchestratorModule,
  CheckoutProgressMobileBottomModule,
  CheckoutProgressMobileTopModule,
  CheckoutProgressModule
} from '@spartacus/checkout/base/components';
import { TmaCheckoutPaymentMethodModule } from './checkout-payment-method/tma-checkout-payment-method.module';
import { TmaCheckoutDeliveryModeModule } from './checkout-delivery-mode/tma-checkout-delivery-mode.module';

@NgModule({
  imports: [
    CommonModule,
    CheckoutOrchestratorModule,
    TmaCheckoutOrderSummaryModule,
    CheckoutProgressModule,
    CheckoutProgressMobileTopModule,
    CheckoutProgressMobileBottomModule,
    TmaCheckoutDeliveryModeModule,
    TmaCheckoutPaymentMethodModule,
    PromotionsModule,
    TmaReviewSubmitModule,
    CheckoutDeliveryAddressModule,
    TmaPlaceOrderModule
  ],
})
export class TmaCheckoutComponentModule extends CheckoutComponentsModule { }
