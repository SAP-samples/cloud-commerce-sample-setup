// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItemUsageChargeComponent } from './cart-item-usage-charge/cart-item-usage-charge.component';
import { CartItemRecurringChargeComponent } from './cart-item-recurring-charge/cart-item-recurring-charge.component';
import { CartItemOneTimeChargeComponent } from './cart-item-one-time-charge/cart-item-one-time-charge.component';
import { I18nModule } from '@spartacus/core';

@NgModule({
  declarations: [CartItemUsageChargeComponent, CartItemRecurringChargeComponent, CartItemOneTimeChargeComponent],
  imports: [
    CommonModule,
    NgbModule,
    I18nModule,
  ],
  exports: [CartItemUsageChargeComponent, CartItemRecurringChargeComponent, CartItemOneTimeChargeComponent]
})
export class CartItemPriceModule { }
