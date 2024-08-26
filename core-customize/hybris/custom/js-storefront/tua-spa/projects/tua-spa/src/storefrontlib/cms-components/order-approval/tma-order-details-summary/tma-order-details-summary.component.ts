// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnInit } from '@angular/core';
import { TmaProductOrder } from '../../../../core/model';
import { CurrencyService } from '@spartacus/core';
import { TmaProductOrderPriceService } from '../../../../core/product-order/service';

@Component({
  selector: 'cx-order-details-summary',
  templateUrl: './tma-order-details-summary.component.html'
})
export class TmaOrderDetailsSummaryComponent implements OnInit {

  @Input()
  productOrder: TmaProductOrder;

  subtotalAfterDiscounts: number;
  shippingCost: number;
  totalCost: number;
  taxAmount: number;

  constructor(
    public currencyService: CurrencyService,
    protected productOrderPriceService: TmaProductOrderPriceService
  ) {
  }

  ngOnInit(): void {
    this.subtotalAfterDiscounts = this.productOrderPriceService.getSubtotalAfterDiscountsDutyFree(this.productOrder);
    if (!this.subtotalAfterDiscounts) {
      this.subtotalAfterDiscounts = 0;
    }

    this.shippingCost = this.productOrderPriceService.getShippingCostDutyFree(this.productOrder);
    this.totalCost = this.subtotalAfterDiscounts + this.shippingCost;

    if (!this.totalCost) {
      this.totalCost = 0;
    }

    const subtotalAfterTaxes: number = this.productOrderPriceService.getSubtotalAfterDiscountsAfterTaxes(this.productOrder);
    const shippingAfterTaxes: number = this.productOrderPriceService.getShippingCostAfterTaxes(this.productOrder);

    this.taxAmount = (subtotalAfterTaxes + shippingAfterTaxes) - this.totalCost;
  }

}
