// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaCart } from '../../../../core/model';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutOrderSummaryComponent } from '@spartacus/checkout/base/components';

@Component({
  selector: 'cx-checkout-order-summary',
  templateUrl: './tma-checkout-order-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutOrderSummaryComponent extends CheckoutOrderSummaryComponent {

  cart$: Observable<TmaCart>;

  constructor(protected activeCartFacade: ActiveCartFacade) {
    super(activeCartFacade);
  }
}
