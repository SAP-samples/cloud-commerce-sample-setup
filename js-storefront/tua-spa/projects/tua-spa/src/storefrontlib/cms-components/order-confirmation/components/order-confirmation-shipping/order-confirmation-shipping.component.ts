/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  CartOutlets,
  DeliveryMode,
  OrderEntry,
} from '@spartacus/cart/base/root';
import { Address, TranslationService } from '@spartacus/core';
import {
  deliveryAddressCard,
  deliveryModeCard,
  Order,
  OrderFacade,
} from '@spartacus/order/root';
import { Card, OutletContextData } from '@spartacus/storefront';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OrderConfirmationShippingComponent } from '@spartacus/order/components';

@Component({
  selector: 'cx-order-confirmation-shipping',
  templateUrl: './order-confirmation-shipping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaOrderConfirmationShippingComponent extends OrderConfirmationShippingComponent implements OnInit, OnDestroy {
  constructor(
    protected orderFacade: OrderFacade,
    protected translationService: TranslationService,
    protected cd: ChangeDetectorRef,
  ) {
    super(orderFacade, translationService, cd);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
