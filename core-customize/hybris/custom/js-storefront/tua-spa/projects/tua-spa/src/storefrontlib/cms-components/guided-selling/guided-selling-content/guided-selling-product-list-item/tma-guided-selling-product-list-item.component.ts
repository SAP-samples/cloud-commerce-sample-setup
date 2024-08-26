// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyService } from '@spartacus/core';
import { TmaConfigurablePscInputsDataHandlingService } from '../../../../../core';
import { Subscription } from 'rxjs';
import {
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingProductConfigSelectionsService,
  TmaGuidedSellingStepsService
} from '../../../../../core/guided-selling/facade';
import {
  TmaProduct,
  TmaPscvuProductCharaceristic,
  TmaSelectionAction,
  TmfProduct,
  TmfProductCharacteristic
} from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';
import { TmaProductListItemComponent } from '../../../product/product-list';
import { ProductListItemContext, ProductListItemContextSource } from '@spartacus/storefront';

@Component({
  selector: 'cx-guided-selling-product-list-item',
  templateUrl: './tma-guided-selling-product-list-item.component.html',
  styleUrls: ['./tma-guided-selling-product-list-item.component.scss'],
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class TmaGuidedSellingProductListItemComponent
  extends TmaProductListItemComponent
  implements OnInit, OnDestroy {
  @Input()
  tmfProducts: TmfProduct[];

  isSelected: boolean;

  protected subscription = new Subscription();

  constructor(
    public productListItemContextSource: ProductListItemContextSource,
    public priceService: TmaPriceService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected currencyService?: CurrencyService,
    protected activatedRoute?: ActivatedRoute,
    protected guidedSellingStepsService?: TmaGuidedSellingStepsService,
    protected configurablePscvusService?: TmaConfigurablePscInputsDataHandlingService,
    protected guidedSellingProductConfigSelectionsService?: TmaGuidedSellingProductConfigSelectionsService
  ) {
    super(productListItemContextSource, priceService,currencyService);
  }

  ngOnInit(): void {
    this.isSelected = !!this.guidedSellingCurrentSelectionsService
      .getCurrentSelections()
      .find(
        (currentSelection: TmaProduct) =>
          currentSelection.code === this.product.code
      );
    this.subscription.add(
      this.guidedSellingCurrentSelectionsService.selection$
        .subscribe(
          (selection: { product: TmaProduct; action: TmaSelectionAction }) => {
            this.isSelected =
              !(
                selection.action === TmaSelectionAction.REMOVE &&
                this.product.code === selection.product.code
              ) && this.isSelected;
          }
        )
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
    this.configurablePscvusService.selectPressed = isSelected;
    this.configurablePscvusService.setUpContext(this.product);

    this.isSelected = isSelected;
    this.guidedSellingCurrentSelectionsService.changeSelection(
      this.product,
      this.isSelected ? TmaSelectionAction.ADD : TmaSelectionAction.REMOVE
    );
    this.updateProduct(this.product, this.isSelected);
  }

  updateProduct(product: TmaProduct, selected: boolean): void {
    const bpoCode = this.activatedRoute.snapshot.url[1].toString();
    const guidedSellingSteps =
      this.guidedSellingStepsService.getGuidedSellingSteps(bpoCode);
    const activeStep = guidedSellingSteps.find((step) => step.active === true);
    if (selected) {
      let characteristics: TmaPscvuProductCharaceristic[] = [];
      characteristics = characteristics
        .concat(this.configurablePscvusService.getProductCharacteristics())
        .filter(
          (pscvu: TmaPscvuProductCharaceristic) =>
            pscvu.productCode === product.code
        );
      this.guidedSellingProductConfigSelectionsService.addConfig(
        activeStep.id,
        characteristics.map<TmfProductCharacteristic>(
          (pscvu: TmaPscvuProductCharaceristic) => ({
            name: pscvu.name,
            value: pscvu.value
          })
        ),
        product.code
      );
    } else {
      this.guidedSellingProductConfigSelectionsService.removeConfig(
        activeStep.id,
        product.code
      );
      this.configurablePscvusService.removePscvusFromMap(product.code);
    }
  }

  /**
   * Sets shouldRemoveCurrentSelections attribute.
   *
   * @param shouldRemoveCurrentSelections - Flag which indicates if current selections should be removed or not.
   */
  setShouldRemoveCurrentSelections(
    shouldRemoveCurrentSelections: boolean
  ): void {
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections =
      shouldRemoveCurrentSelections;
  }
}
