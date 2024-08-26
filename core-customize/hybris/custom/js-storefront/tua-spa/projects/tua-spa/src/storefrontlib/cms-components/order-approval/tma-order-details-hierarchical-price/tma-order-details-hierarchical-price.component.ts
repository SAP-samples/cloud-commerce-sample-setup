// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaOrderPrice, TmaPriceAlteration } from '../../../../core/model';

@Component({
  selector: 'cx-order-details-hierarchical-price',
  templateUrl: './tma-order-details-hierarchical-price.component.html',
  styleUrls: ['./tma-order-details-hierarchical-price.component.scss']
})
export class TmaOrderDetailsHierarchicalPriceComponent {

  @Input()
  itemPrices?: TmaOrderPrice[];

  @Input()
  priceAlterations?: TmaPriceAlteration[];

}
