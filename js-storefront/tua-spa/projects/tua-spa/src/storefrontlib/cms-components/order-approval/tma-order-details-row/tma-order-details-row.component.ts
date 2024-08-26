// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnInit } from '@angular/core';
import { TmaOrderItem } from '../../../../core/model';
import { CurrencyService } from '@spartacus/core';
import { TmaProductOrderPriceService } from '../../../../core/product-order/service';

@Component({
  selector: 'cx-order-details-row',
  templateUrl: './tma-order-details-row.component.html',
  styleUrls: ['./tma-order-details-row.component.scss']
})
export class TmaOrderDetailsRowComponent implements OnInit {

  @Input()
  orderItem: TmaOrderItem;

  payOnCheckoutBeforeDiscounts: string;
  payOnCheckoutAfterDiscounts: string;

  constructor(
    public currencyService: CurrencyService,
    protected productOrderPriceService: TmaProductOrderPriceService
  ) {
  }

  ngOnInit(): void {
    const payOnCheckoutBeforeDiscountsAsNumber = this.productOrderPriceService.getPayOnCheckoutBeforeDiscountsDutyFree(this.orderItem);
    const payOnCheckoutAfterDiscountsAsNumber = this.productOrderPriceService.getPayOnCheckoutAfterDiscountsDutyFree(this.orderItem);

    this.payOnCheckoutBeforeDiscounts = payOnCheckoutBeforeDiscountsAsNumber.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });
    this.payOnCheckoutAfterDiscounts = payOnCheckoutAfterDiscountsAsNumber.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    });
  }

}
