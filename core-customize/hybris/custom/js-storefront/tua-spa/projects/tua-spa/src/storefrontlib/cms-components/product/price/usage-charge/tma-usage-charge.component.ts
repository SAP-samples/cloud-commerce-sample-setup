// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaProductOfferingPrice } from '../../../../../core/model';

@Component({
  selector: 'cx-usage-charge',
  templateUrl: './tma-usage-charge.component.html'
})
export class TmaUsageChargeComponent {

  @Input()
  usageCharge: TmaProductOfferingPrice;

  constructor() {
  }
}
