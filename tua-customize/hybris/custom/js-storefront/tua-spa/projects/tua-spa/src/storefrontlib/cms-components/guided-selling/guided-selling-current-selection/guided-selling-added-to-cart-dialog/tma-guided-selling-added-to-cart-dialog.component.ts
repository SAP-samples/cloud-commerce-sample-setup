// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { TmaCartPriceService } from '../../../../../core/cart/facade';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CurrencyService, RoutingService } from '@spartacus/core';
import { TmaOrderEntry, TmaProduct, TmaProductOfferingPrice } from '../../../../../core/model';
import { LaunchDialogService } from '@spartacus/storefront';
import { TmaGuidedSellingCurrentSelectionsService } from '../../../../../core/guided-selling/facade';
import { TmaPriceService } from '../../../../../core/product/facade';
import { Observable, Subscription } from 'rxjs';
import { TmaAddedToCartDialogComponent } from '../../../cart/add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.component';
import { TmaActiveCartFacade } from '../../../../../core';

@Component({
  selector: 'cx-guided-selling-added-to-cart-dialog',
  templateUrl: './tma-guided-selling-added-to-cart-dialog.component.html',
  styleUrls: ['./tma-guided-selling-added-to-cart-dialog.component.scss'],
})
export class TmaGuidedSellingAddedToCartDialogComponent
  extends TmaAddedToCartDialogComponent
  implements OnInit, OnDestroy {
  @Input()
  parentBpo: TmaProduct;

  @Input()
  entries: TmaOrderEntry[];
  protected subscription = new Subscription();
  constructor(
    public cartPriceService: TmaCartPriceService,
    protected launchDialogService: LaunchDialogService,
    protected activeCartFacade: TmaActiveCartFacade,
    protected routingService: RoutingService,
    protected el: ElementRef,
    protected fb: FormBuilder,
    protected currencyService: CurrencyService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected priceService: TmaPriceService
  ) {
    super(
      cartPriceService,
      currencyService,
      activeCartFacade,
      launchDialogService,
      routingService,
      el
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
    this.entries = this.processEntries();
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data !== undefined) {
          this.entry$ = data.entry$;
        this.entries = data.entries;
        this.parentBpo = data.parentBpo;
        this.cart$ = data.cart$;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  /**
   * Clears the current selection list.
   */
  clearCurrentSelections(): void {
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
  }

  /**
   * Returns the sum of one time charges as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getPayNowPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0) {
      return '-';
    }

    const oneTimePrices: TmaProductOfferingPrice[] = this.priceService.getOneTimeCharges(
      price[0]
    );
    if (!oneTimePrices || oneTimePrices.length === 0) {
      return '-';
    }

    return this.priceService.getFormattedPrice(
      this.priceService.getSumOfPrices(oneTimePrices)
    );
  }

  /**
   * Returns the first recurring charge as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getRecurringPrice(price: TmaProductOfferingPrice[]): string {
    if (!price || price.length === 0 || !price[0].bundledPop) {
      return '-';
    }

    const recurringPrices: TmaProductOfferingPrice[] = this.priceService.getRecurringPrices(
      price[0].bundledPop
    );
    if (
      !recurringPrices ||
      recurringPrices.length === 0 ||
      !recurringPrices[0].price
    ) {
      return '-';
    }

    return this.priceService.getFormattedPrice(recurringPrices[0].price);
  }

  /**
   * Returns the entry for the provided number.
   *
   * @param entryNumber - The identifier of the entry
   * @return A {@link TmaOrderEntry} as an {@link Observable}
   */
  getEntryFor(entryNumber: number): Observable<TmaOrderEntry> {
    return this.activeCartFacade.getEntryFor(entryNumber);
  }

  protected processEntries(): TmaOrderEntry[] {
    if (!this.entries || this.entries.length === 0) {
      return [];
    }

    this.entries.forEach((entry: TmaOrderEntry) => {
      if (entry) {
        const code: string = entry.entryNumber.toString();
        if (!this.form.controls[code]) {
          this.form.setControl(code, this.createFormGroupForEntry(entry));
        } else {
          const entryForm = this.form.controls[code] as FormGroup;
          entryForm.controls.quantity.setValue(entry.quantity);
        }

        this.form.markAsPristine();
      }
    });

    return this.entries;
  }

  protected createFormGroupForEntry(entry: TmaOrderEntry): FormGroup {
    return this.fb.group({
      entryNumber: entry.entryNumber,
      quantity: entry.quantity,
    });
  }
}
