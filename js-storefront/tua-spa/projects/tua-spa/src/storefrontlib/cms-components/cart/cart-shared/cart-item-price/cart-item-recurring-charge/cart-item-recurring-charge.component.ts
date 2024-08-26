// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-cart-item-recurring-charge',
  templateUrl: './cart-item-recurring-charge.component.html',
})
export class CartItemRecurringChargeComponent{

  @Input()
  recurringCharge: TmaCartPrice;

  constructor() {
  }

}
