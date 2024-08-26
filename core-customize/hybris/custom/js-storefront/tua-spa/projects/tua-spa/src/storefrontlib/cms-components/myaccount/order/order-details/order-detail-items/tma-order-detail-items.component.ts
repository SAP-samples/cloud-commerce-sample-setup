// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component } from '@angular/core';
import { TmaOrder, TmaOrderEntry } from '../../../../../../core';
import { OrderDetailItemsComponent, OrderDetailsService } from '@spartacus/order/components';
import { CmsComponentData } from '@spartacus/storefront';
import { CmsOrderDetailItemsComponent } from '@spartacus/core';
import { Consignment } from '@spartacus/order/root';
import { ConsignmentEntry } from '@spartacus/cart/base/root';

@Component({
  selector: 'cx-order-details-items',
  templateUrl: './tma-order-detail-items.component.html'
})
export class TmaOrderDetailItemsComponent extends OrderDetailItemsComponent {
  constructor(
    protected orderDetailsService: OrderDetailsService,
    protected component: CmsComponentData<CmsOrderDetailItemsComponent>
  ) {
    super(orderDetailsService, component);
  }

  /**
   * Checks for product present inside the entries of an consignment.
   *
   * @param consigment as an {@link Consignment}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkConsignmentFor(consigment: Consignment): boolean {
    let entry: ConsignmentEntry;
    if (consigment.entries) {
      entry = consigment.entries.find(
        (item: ConsignmentEntry) =>
          Object.keys(item.orderEntry.product).length === 0
      );
    }
    return entry === undefined;
  }

  /**
   * Checks for product present inside the entries of an order.
   *
   * @param order as an {@link Order}
   *
   * @return true if there is entry having product otherwise false {@link boolean}
   */
  checkOrderFor(order: TmaOrder): boolean {
    let entry: TmaOrderEntry;
    if (order.unconsignedEntries) {
      entry = order.unconsignedEntries.find(
        (item: TmaOrderEntry) => Object.keys(item.product).length === 0
      );
    }
    return entry === undefined;
  }
}
