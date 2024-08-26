// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService, Price } from '@spartacus/core';
import { Observable } from 'rxjs';
import { TmaCart, TmaOrderEntry } from '../../../../../core/model';
import { OrderSummaryComponent } from '@spartacus/cart/base/components';
import { TmaCartPriceService } from '../../../../../core';

@Component({
  selector: 'cx-order-summary',
  templateUrl: './tma-order-summary.component.html'
})
export class TmaOrderSummaryComponent extends OrderSummaryComponent implements OnInit {

  @Input()
  cart: TmaCart;

  currency$: Observable<string>;

  constructor(
    protected cartPriceService: TmaCartPriceService,
    protected currencyService: CurrencyService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }

  getTotalRecurringChargePrice(): string {
    let totalItemPrices = [];
    let currency: string;
    this.cart.entries.forEach((item: TmaOrderEntry) => {
      const recurringPrice: Price = this.cartPriceService.computeEntryPrice(item)?.recurringPrices[0]?.taxIncludedAmount;
      if (recurringPrice?.value) {
        currency = recurringPrice.currencyIso;
        totalItemPrices.push(Number(recurringPrice.value));
      }
    });
    if (totalItemPrices.length) {
      let totalFinalPrice = totalItemPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      return this.cartPriceService.getFormattedPrice({ value: totalFinalPrice, currencyIso: currency });
    }
  }
}
