// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  CheckoutConnector,
  CheckoutDeliveryAddressConnector,
  CheckoutDeliveryAddressService,
  CheckoutDeliveryModesConnector,
  CheckoutPaymentConnector
} from '@spartacus/checkout/base/core';

@NgModule({
  imports: []
})
export class TmaCheckoutModule {
  static forRoot(): ModuleWithProviders<TmaCheckoutModule> {
    return {
      ngModule: TmaCheckoutModule,
      providers: [
        CheckoutDeliveryAddressService,
        CheckoutDeliveryAddressConnector,
        CheckoutDeliveryModesConnector,
        CheckoutPaymentConnector,
        CheckoutConnector
      ]
    };
  }
}
