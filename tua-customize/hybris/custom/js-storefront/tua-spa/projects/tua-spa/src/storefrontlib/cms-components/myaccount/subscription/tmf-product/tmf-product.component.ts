// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TmfProductService } from '../../../../../core';
import {
  TmaCartItemPrice,
  TmaOrder,
  TmaOrderEntry,
  TmaTmfRelatedParty,
  TmfProduct,
  TmfProductRelatedPartyRole
} from '../../../../../core/model';
import { CurrencyService, User } from '@spartacus/core';
import { TmaCartPriceService } from '../../../../../core/cart/facade';

@Component({
  selector: 'cx-tmf-product',
  templateUrl: './tmf-product.component.html',
  styleUrls: ['./tmf-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TmfProductComponent implements OnInit, OnDestroy {
  @Input()
  tmfProductId: string;
  @Input()
  tmfProduct: TmfProduct;
  @Input()
  subscriptionId?: string;
  @Input()
  order?: TmaOrder;

  tmfProductDetail$: Observable<TmfProduct>;
  currency$: Observable<string>;
  isOwner: boolean;
  baseSiteId: string;
  isEligibleForTermination$: Observable<boolean>;
  status: string;
  protected user: User;

  constructor(
    public priceService: TmaCartPriceService,
    protected tmfProductService: TmfProductService,
    protected currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currency$ = this.currencyService.getActive();
  }

  ngOnDestroy(): void {
    this.tmfProductService.clearTmfProductDetails();
  }

  getProductOrderEntry(order: TmaOrder, entryNumber: string): TmaOrderEntry {
    let userOrderEntry: TmaOrderEntry;
    if (!!order && !!order.entries) {
      userOrderEntry = this.getEntry(order.entries, entryNumber);
    }
    return userOrderEntry;
  }

  /**
   * Filters the order entry list with a given entry number.   *
   *
   * @param entries the list of order entries.
   *
   * @return order entry as {@link TmaOrderEntry}.
   */
  getEntry(entries: TmaOrderEntry[], entryNumber: string): TmaOrderEntry {
    let orderEntry: TmaOrderEntry;
    if (entries) {
      entries.forEach((entry: TmaOrderEntry) => {
        if (entry.entryNumber.toString() === entryNumber) {
          orderEntry = entry;
          return;
        } else {
          const productOrderEntry = this.getEntry(entry.entries, entryNumber);
          if (productOrderEntry) {
            orderEntry = productOrderEntry;
            return;
          }
        }
      });
    }
    return orderEntry;
  }

  getPrices(entry: TmaOrderEntry): TmaCartItemPrice {
    if (!!entry) {
      const item: TmaOrderEntry = { entryNumber: null };
      Object.assign(item, entry);
      return this.priceService.computeEntryPrice(item);
    }
    return null;
  }

  getRole(relatedParty: TmaTmfRelatedParty[]): boolean {
    relatedParty.forEach((customer) => {
      if (customer.id === this.user.uid) {
        this.isOwner = customer.role === TmfProductRelatedPartyRole.OWNER;
      }
    });
    return this.isOwner;
  }
}
