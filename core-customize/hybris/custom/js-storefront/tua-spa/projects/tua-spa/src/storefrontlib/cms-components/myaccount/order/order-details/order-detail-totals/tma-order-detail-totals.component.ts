// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaOrder } from '../../../../../../core/model';
import { OrderDetailsService, OrderDetailTotalsComponent } from '@spartacus/order/components';

@Component({
  selector: 'cx-order-details-totals',
  templateUrl: './tma-order-detail-totals.component.html',
})
export class TmaOrderDetailTotalsComponent extends OrderDetailTotalsComponent {

  order$: Observable<TmaOrder>;

  constructor(protected orderDetailsService: OrderDetailsService) {
    super(orderDetailsService);
  }
}
