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
  Optional
} from '@angular/core';
import { concat, Observable, Subscription } from 'rxjs';
import {
  AvailabilityCheckService,
  GeographicAddress,
  GeographicAddressService,
  LOCAL_STORAGE,
  SearchTimeSlotService,
  TmaChecklistAction,
  TmaChecklistActionService,
  TmaChecklistActionType,
  TmaChecklistActionTypeCheckService,
  TmaConfigurablePscInputsDataHandlingService,
  TmaConstantResourceModel,
  TmaProduct,
  TmaProductService
} from '../../../../core';
import { filter, first, take } from 'rxjs/operators';
import {
  BaseSiteService,
  GlobalMessageService,
  GlobalMessageType,
  isNotNullable,
  TranslationService
} from '@spartacus/core';
import { CurrentProductService, ProductListItemContext } from '@spartacus/storefront';
import { TmaAddToCartService } from '../../../../core/add-to-cart';

const { PURCHASE_WITH_ASSURANCE_FEATURE
} = LOCAL_STORAGE.TMA_FEATURE_FLAGS

@Component({
  selector: 'cx-product-checklist',
  templateUrl: './tma-product-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TmaProductChecklistComponent implements OnInit, OnDestroy {
  @Input() productCode: string;

  contractStartDate: string;
  serviceProvider: string;
  isMoveIn: boolean;
  tmaProduct: TmaProduct;

  protected baseSiteId: string;
  protected subscription = new Subscription();
  currentProduct$: Observable<TmaProduct>;
  protected readonly PURCHASE_WITH_ASSURANCE_FEATURE = PURCHASE_WITH_ASSURANCE_FEATURE;

  constructor(public productSpecificationProductService: TmaProductService,
              public tmaChecklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
              public configurablePscvusService: TmaConfigurablePscInputsDataHandlingService,
              protected tmaChecklistActionService: TmaChecklistActionService,
              protected tmaAddToCartService: TmaAddToCartService,
              protected baseSiteService: BaseSiteService,
              protected currentProductService: CurrentProductService,
              protected geographicAddressService: GeographicAddressService,
              protected searchTimeSlotService: SearchTimeSlotService,
              protected availabilityCheckService: AvailabilityCheckService,
              protected globalMessageService: GlobalMessageService,
              protected translationService: TranslationService,
              protected cd: ChangeDetectorRef,
              @Optional() protected productListItemContext: ProductListItemContext
  ) {
    this.currentProduct$ = this.currentProductService.getProduct();
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );
  }

  ngOnInit() {
    if (!this.productCode) {
      this.subscription.add(
        (
        this.productListItemContext
          ? this.productListItemContext.product$
          : this.currentProductService.getProduct()
        )
        .pipe(filter(isNotNullable))
        .subscribe((product) => {
          this.productCode = product.code ?? '';
          this.cd.markForCheck();
        })
      );
    }
    this.isMoveIn = true;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.tmaAddToCartService.clearAddToCartPayloadState();
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }

  /**
   * Returns the checklist actions for the provided product code
   *
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   * @param product
   */
  getChecklistActions(product: TmaProduct): Observable<TmaChecklistAction[]> {
      if (product.isBundle) {
      const children = product.children.map((child: TmaProduct) => {
        return child.code;
      })
      return this.tmaChecklistActionService.getChecklistActionsFor(
          this.baseSiteId,
          children
      );
    }

    return this.tmaChecklistActionService.getChecklistActionForProductCode(
      this.baseSiteId,
      product.code
    );
  }

  getDisplayChecklists(product: TmaProduct): Observable<string> {
    if (product.isBundle) {
      const dependencies: Observable<string>[] = product.children.map(child =>
        this.tmaChecklistActionService.getCurrentViewForDependentProduct(child.code)
      );

      return concat(...dependencies);
    }
    return this.tmaChecklistActionService.getCurrentViewForDependentProduct(product.code);
  }

  /**
   * Checks if installation address is provided or not
   *
   * @return True if has installation address present, otherwise false
   */
  isInstallationAddressSelected(): boolean {
    let selectedInstallationAddress: boolean = false;
    this.subscription.add(
      this.geographicAddressService
        .getSelectedInstallationAddress()
        .pipe(
          take(2),
          filter((result: GeographicAddress) => !!result)
        )
        .subscribe((result: GeographicAddress) => {
          if (Object.keys(result).length > 0) {
            selectedInstallationAddress = true;
          }
        })
    );
    return selectedInstallationAddress;
  }

  /**
   * Checks if the Add To Cart button should be displayed
   *
   * @param checklistActions - list of checklist actions
   * @param productSpecificationId - product specification id
   */
  shouldDisplayAddToCartButton(
    checklistActions: TmaChecklistAction[],
    productSpecificationId: string
  ): boolean {
    if (
      !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      )
    ) {
      return !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      );
    }
    if (
      checklistActions.find(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
      )
    ) {
      return false;
    }
    this.translationService
      .translate('premiseDetails.checkAvailabilityErrorMessage')
      .pipe(first((translation: string) => !!translation))
      .subscribe((translation: string) =>
        this.globalMessageService.add(
          translation,
          GlobalMessageType.MSG_TYPE_ERROR
        )
      )
      .unsubscribe();
    return true;
  }
}

