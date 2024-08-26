// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';


@Component({
  selector: 'cx-cart-item-usage-charge',
  templateUrl: './cart-item-usage-charge.component.html',
})
export class CartItemUsageChargeComponent{
  @Input()
  usageCharge: TmaCartPrice;

  constructor() {
  }
}
