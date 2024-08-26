// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProcessTypeEnum } from '../../model';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as TmaChecklistAction from '../store/actions/tma-checklist-action.action';
import * as TmaChecklistActionModel from '../../model/tma-checklist-action.model';
import { select, Store } from '@ngrx/store';
import { TmaChecklistActionMap, TmaStateWithChecklistAction } from '../store';
import * as TmaChecklistActionSelectors from '../store/selectors/tma-checklist-action.selector';
import { tap } from 'rxjs/operators';
import { BaseSiteService } from '@spartacus/core';

@Injectable()
export class TmaChecklistActionService implements OnDestroy {

  protected activeBaseSite: string;
  protected subscription = new Subscription();

  /**
   *
   * @deprecated Since 2.0
   * Add baseSiteService
   */
  constructor(
    store: Store<TmaStateWithChecklistAction>
  );

  constructor(
    protected store: Store<TmaStateWithChecklistAction>,
    protected baseSiteService?: BaseSiteService
  ) {
    if (this.baseSiteService) {
      this.subscription.add(
        this.baseSiteService
          .getActive()
          .subscribe((baseSiteId: string) => (this.activeBaseSite = baseSiteId))
        );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * This method is used to retrieve checklist actions for defined product and process type
   * @param baseSiteId  The base site Id
   * @param productCode The product code
   * @param processType? The process type to find the checklist actions
   * @param isDependentProduct Indicates whether the product is dependent.
   * @param isInstallationAddressSelected Indicates whether the installation address is selected.
   * @returns TmaChecklistActionModel.TmaChecklistAction[] The applicable checklist actions
   */
  getChecklistActionForProductCode(
    baseSiteId: string,
    productCode: string,
    processType?: TmaProcessTypeEnum,
    isDependentProduct?: boolean,
    isInstallationAddressSelected?: boolean
  ): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    if (productCode) {
      return this.store.pipe(
        select(TmaChecklistActionSelectors.getChecklistActionForProductCode, {
          productCode,
          baseSiteId,
          processType,
          isDependentProduct,
          isInstallationAddressSelected
        }),
        tap((checklistActions: TmaChecklistActionModel.TmaChecklistAction[]) => {
          if (
            checklistActions === undefined ||
            Object.keys(checklistActions).length === 0
          ) {
            this.store.dispatch(
              new TmaChecklistAction.LoadChecklistActions({
                baseSiteId,
                productCode,
                processType,
                isDependentProduct,
                isInstallationAddressSelected
              })
            );
          }
        })
      );
    }
  }

  /**
   * Retrieves the checklist actions for multiple product offerings based on process type
   *
   * @param baseSiteId  The base site Id
   * @param productOfferingCodes The list of product offering codes
   * @param processType? The process type to find the checklist actions
   * @returns TmaChecklistActionModel.TmaChecklistAction[] The applicable checklist actions
   */
  getChecklistActionsFor(
    baseSiteId: string,
    productOfferingCodes: string[],
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistActionModel.TmaChecklistAction[]> {
    this.store.dispatch(
      new TmaChecklistAction.LoadChecklistActions({
        baseSiteId,
        productOfferingCodes,
        processType
      })
    );
    return this.store.pipe(
      select(TmaChecklistActionSelectors.getChecklistActionForPoCodes, {
        productOfferingCodes,
        baseSiteId,
        processType
      })
    );
  }

  /**
   * Retrieves the checklist actions details
   *
   * @returns Observable<TmaChecklistActionModel.TmaCheckListActionDetails[]>
   *                The stored checklist actions details
   */
  getChecklistActionDetails() : Observable<TmaChecklistActionModel.TmaCheckListActionDetails[]> {
    return this.store.select(TmaChecklistActionSelectors.getAllChecklistActionsDetails)
  }

  /**
   * Retrieves the configured checklist actions
   *
   * @returns Observable<TmaChecklistActionMap>
   *                The stored checklist actions for a commodity service
   */
  getAllChecklistActionsForCommodityService() : Observable<TmaChecklistActionMap> {
    return this.store.select(TmaChecklistActionSelectors.getAllChecklistActionsForCommodityService)
  }

  /**
   * This method is used to check if the product is a dependent product and the installation address is selected
   * @param productCode The product code
   *
   * @returns Observable<string>
   *                Containing the message depending on the product
   */
  getCurrentViewForDependentProduct(productCode: string): Observable<string> {
    return this.store.pipe(
      select(TmaChecklistActionSelectors.getCurrentViewForDependentProduct, {
        productCode
      })
    );
  }

  /**
   * This method clears all checklist actions Add to cart payload details.
   */
  clearChecklistActionWithAddToCartDetails(): void {
    this.store.dispatch(
      new TmaChecklistAction.ClearChecklistActionDetails()
    )
  }

  /**
   * This method clears all the checklist actions state.
   */
  clearAllChecklistActionsState(): void {
    this.store.dispatch(
      new TmaChecklistAction.ClearAllChecklistActions()
    )
  }

  /**
   * This method clears the geographic address state.
   */
  clearSelectedGeographicAddressState(productCode: string): void {
    this.store.dispatch(
      new TmaChecklistAction.ClearSelectedInstallationAddress(productCode)
    );
  }
}
