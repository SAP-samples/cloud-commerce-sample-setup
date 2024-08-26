// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaCartPrice } from '../../../../../../core/model';

@Component({
  selector: 'cx-cart-item-one-time-charge',
  templateUrl: './cart-item-one-time-charge.component.html',
})
export class CartItemOneTimeChargeComponent{
  @Input()
  oneTimeCharge: TmaCartPrice;

  constructor() {
  }

}
