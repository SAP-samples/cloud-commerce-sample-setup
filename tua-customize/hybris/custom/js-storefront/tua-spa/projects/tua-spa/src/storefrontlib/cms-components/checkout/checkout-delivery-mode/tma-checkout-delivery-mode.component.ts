// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutConfigService, CheckoutDeliveryModeComponent, CheckoutStepService } from '@spartacus/checkout/base/components';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CheckoutDeliveryModesFacade } from '@spartacus/checkout/base/root';
import { EventService } from '@spartacus/core';
import { CheckoutSupportedDeliveryModesQueryResetEvent } from '@spartacus/checkout/base/root';

@Component({
  selector: 'cx-delivery-mode',
  templateUrl: './tma-checkout-delivery-mode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCheckoutDeliveryModeComponent extends CheckoutDeliveryModeComponent {

  constructor(
    protected fb: UntypedFormBuilder,
    protected checkoutConfigService: CheckoutConfigService,
    protected activatedRoute: ActivatedRoute,
    protected checkoutStepService: CheckoutStepService,
    protected checkoutDeliveryModesFacade: CheckoutDeliveryModesFacade,
    protected activeCartFacade: ActiveCartFacade,
    protected eventService: EventService
  ) {
    super(fb, checkoutConfigService, activatedRoute, checkoutStepService, checkoutDeliveryModesFacade, activeCartFacade);
    this.eventService.dispatch(
      {},
      CheckoutSupportedDeliveryModesQueryResetEvent
    );
  }
}
