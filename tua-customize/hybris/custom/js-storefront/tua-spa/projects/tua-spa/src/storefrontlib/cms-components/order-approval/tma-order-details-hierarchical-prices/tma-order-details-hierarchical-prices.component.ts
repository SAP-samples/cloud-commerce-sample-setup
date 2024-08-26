// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaOrderItem } from '../../../../core/model';

@Component({
  selector: 'cx-order-details-hierarchical-prices',
  templateUrl: './tma-order-details-hierarchical-prices.component.html'
})
export class TmaOrderDetailsHierarchicalPricesComponent {

  @Input()
  orderItem: TmaOrderItem;

}
