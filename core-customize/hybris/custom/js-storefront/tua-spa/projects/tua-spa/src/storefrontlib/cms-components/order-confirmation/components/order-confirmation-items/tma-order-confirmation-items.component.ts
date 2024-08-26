// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Order, OrderFacade } from '@spartacus/order/root';
import { CartOutlets, PromotionLocation } from '@spartacus/cart/base/root';
import { Observable } from 'rxjs';

@Component({
  selector: 'cx-order-confirmation-items',
  templateUrl: './tma-order-confirmation-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOrderConfirmationItemsComponent implements OnDestroy {
  readonly cartOutlets = CartOutlets;
  promotionLocation: PromotionLocation = PromotionLocation.Checkout;
  order$: Observable<Order | undefined> = this.orderFacade.getOrderDetails();

  constructor(protected orderFacade: OrderFacade) {}

  ngOnDestroy() {
    this.orderFacade.clearPlacedOrder();
  }
}
