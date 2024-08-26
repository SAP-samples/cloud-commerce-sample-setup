// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TmaGuidedSellingCurrentSelectionsService } from '../../../../../core/guided-selling/facade';
import { TmaProduct, TmaSelectionAction, TmfProduct } from '../../../../../core/model';
import { Subscription } from 'rxjs';
import { TmaProductGridItemComponent } from '../../../product/product-list';
import { CurrencyService } from '@spartacus/core';
import { TmaPriceService } from '../../../../../core/product/facade';
import { ProductListItemContext, ProductListItemContextSource } from '@spartacus/storefront';

@Component({
  selector: 'cx-guided-selling-product-grid-item',
  templateUrl: './tma-guided-selling-product-grid-item.component.html',
  styleUrls: ['./tma-guided-selling-product-grid-item.component.scss'],
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class TmaGuidedSellingProductGridItemComponent extends TmaProductGridItemComponent implements OnInit, OnDestroy {

  @Input()
  tmfProducts: TmfProduct[];

  isSelected: boolean;

  protected subscription = new Subscription();

  constructor(
    public priceService: TmaPriceService,
    public productListItemContextSource: ProductListItemContextSource,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected currencyService?: CurrencyService
  ) {
    super(productListItemContextSource, priceService,currencyService);
  }

  ngOnInit(): void {
    this.isSelected = !!this.guidedSellingCurrentSelectionsService.getCurrentSelections()
      .find((currentSelection: TmaProduct) => currentSelection.code === this.product.code);
    this.subscription.add(
      this.guidedSellingCurrentSelectionsService.selection$
        .subscribe((selection: { product: TmaProduct; action: TmaSelectionAction }) => {
          this.isSelected = !(selection.action === TmaSelectionAction.REMOVE && this.product.code === selection.product.code) && this.isSelected;
        })
    );
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Updates the currently selected item.
   *
   * @param isSelected - Flag indicating if the current product is selected
   */
  updateSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
    this.guidedSellingCurrentSelectionsService.changeSelection(this.product, this.isSelected ? TmaSelectionAction.ADD :
      TmaSelectionAction.REMOVE);
  }

  /**
   * Sets shouldRemoveCurrentSelections attribute.
   *
   * @param shouldRemoveCurrentSelections - Flag which indicates if current selections should be removed or not.
   */
  setShouldRemoveCurrentSelections(shouldRemoveCurrentSelections: boolean): void {
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections = shouldRemoveCurrentSelections;
  }
}
