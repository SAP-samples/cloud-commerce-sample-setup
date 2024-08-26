// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  TmaConfigurablePscvu,
  TmaProduct,
  TmaProductSpecCharacteristicValue,
  TmaProductSpecCharValueUse,
  TmaPscvuProductCharaceristic
} from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaConfigurablePscInputsDataHandlingService implements OnDestroy {
  protected subscription = new Subscription();
  shouldAddToCartButtonBeActive = false;
  pscvusProductMap: Map<string, Map<string, TmaProductSpecCharValueUse>> =
    new Map<string, Map<string, TmaProductSpecCharValueUse>>();
  errorMessagesMap: Map<string, boolean> = new Map<string, boolean>();
  mandatoryConfigurablePscvus: TmaProductSpecCharValueUse[] = [];
  addToCartPressed = false;
  selectPressed = false;

  protected displayErrorMessageSubject: Subject<Map<string, boolean>> =
    new BehaviorSubject<Map<string, boolean>>(new Map<string, boolean>());
  displayErrorMessage$: Observable<Map<string, boolean>> =
    this.displayErrorMessageSubject?.asObservable();

  get latestInputPscvuValues(): TmaProductSpecCharValueUse[] {
    const pscvusMap = Array?.from(this.pscvusProductMap?.values());
    let productSpecCharValueUse: TmaProductSpecCharValueUse[] = [];
    pscvusMap.forEach((item: Map<string, TmaProductSpecCharValueUse>) => {
      const data: TmaProductSpecCharValueUse[] = Array?.from(
        item.values()
      )?.filter(
        (pscvu: TmaProductSpecCharValueUse) =>
          pscvu !== undefined &&
          pscvu?.productSpecCharacteristicValue !== undefined &&
          pscvu?.productSpecCharacteristicValue?.length > 0 &&
          !pscvu?.productSpecCharacteristicValue?.some(
            (pscv: TmaProductSpecCharacteristicValue) => pscv === undefined
          )
      );
      productSpecCharValueUse = [...productSpecCharValueUse, ...data];
    });
    return productSpecCharValueUse;
  }

  protected static comparePscvus(
    userInputPscvu: TmaProductSpecCharValueUse,
    mandatoryPscvu: TmaProductSpecCharValueUse
  ): boolean {
    const compareAttributes =
      userInputPscvu?.name === mandatoryPscvu?.name &&
      userInputPscvu?.valueType === mandatoryPscvu?.valueType &&
      userInputPscvu?.minCardinality === mandatoryPscvu?.minCardinality &&
      userInputPscvu?.maxCardinality === mandatoryPscvu?.maxCardinality;

    const comparePscvs =
      TmaConfigurablePscInputsDataHandlingService?.comparePscvArray(
        userInputPscvu?.productSpecCharacteristicValue,
        mandatoryPscvu?.productSpecCharacteristicValue
      );

    return compareAttributes && comparePscvs;
  }

  protected static comparePscvArray(
    userInputPscvArray: TmaProductSpecCharacteristicValue[],
    mandatoryPscvArray: TmaProductSpecCharacteristicValue[]
  ): boolean {
    if (!userInputPscvArray || !mandatoryPscvArray) {
      return false;
    }

    if (userInputPscvArray?.length === 0 || mandatoryPscvArray?.length === 0) {
      return false;
    }

    if (
      mandatoryPscvArray?.length === 1 &&
      mandatoryPscvArray[0]?.value === '##' &&
      userInputPscvArray?.length === 1
    ) {
      return true;
    }

    return !userInputPscvArray?.some(
      (pscv1: TmaProductSpecCharacteristicValue) =>
        !mandatoryPscvArray?.some((pscv2: TmaProductSpecCharacteristicValue) =>
          TmaConfigurablePscInputsDataHandlingService?.comparePscv(pscv1, pscv2)
        )
    );
  }

  protected static comparePscv(
    pscv1: TmaProductSpecCharacteristicValue,
    pscv2: TmaProductSpecCharacteristicValue
  ): boolean {
    if (!pscv1 || !pscv2) {
      return false;
    }

    return pscv1?.value === pscv2?.value;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Adds the observable received from a pscvu input component to the list and refreshes the subscription
   * to the latest values to contain the value from the newly added observable as well
   * @param pscvuSubject received from an pscvu input component
   */
  addInputObservable(pscvuSubject: Subject<TmaConfigurablePscvu>): void {
    const pscvuObservable: Observable<TmaConfigurablePscvu> =
      pscvuSubject?.asObservable();

    this.subscription.add(
      pscvuObservable
        ?.subscribe((pscvu: TmaConfigurablePscvu) => {
          const key: string = pscvu?.name?.concat('_')?.concat(pscvu?.valueType);

          let pscvusMap = this.pscvusProductMap?.get(pscvu?.productCode);

          if (!pscvusMap) {
            pscvusMap = new Map();
          }

          pscvusMap?.set(key, pscvu);

          this.pscvusProductMap?.set(pscvu?.productCode, pscvusMap);

          this.shouldAddToCartButtonBeActive =
            this.areAllMandatoryConfigurablePscvusSet(pscvu?.productCode);
        })
      );
  }

  /**
   * Translate the latest values read from the user input into an array of PSCVUs
   * @return an array of pscvus from the latest values received from user input
   */
  getProductCharacteristics(): TmaPscvuProductCharaceristic[] {
    return this.latestInputPscvuValues
      ?.map<TmaPscvuProductCharaceristic[]>((pscvu: TmaConfigurablePscvu) =>
        pscvu?.productSpecCharacteristicValue?.map<TmaPscvuProductCharaceristic>(
          (pscv: TmaProductSpecCharacteristicValue) => ({
            name: pscvu?.name,
            value: pscv?.value,
            productCode: pscvu?.productCode
          })
        )
      )
      ?.reduce(
        (
          previousValue: TmaPscvuProductCharaceristic[],
          currentValue: TmaPscvuProductCharaceristic[]
        ) => previousValue?.concat(currentValue),
        []
      );
  }

  /**
   * Takes in the product displayed on the PDP and build a reference array containing all the mandatory configurable pscvus for this product
   * @param product displayed on the PDP
   * @return false if passed in parameter is null or undefined
   */
  setUpContext(product: TmaProduct): boolean {
    if (product) {
      this.saveConfigurablePscvus(product);
      return true;
    }
    return false;
  }

  /**
   * Updates a flag which is used to decide if the add to cart button can be enabled
   * @productCode Product Code
   * @return true if all the mandatory pscvus were set
   */
  areAllMandatoryConfigurablePscvusSet(productCode: string): boolean {
    const remainingMandatoryPscvus: TmaProductSpecCharValueUse[] =
      this.mandatoryConfigurablePscvus?.filter(
        (mandatoryPscvu: TmaProductSpecCharValueUse) =>
          !this.latestInputPscvuValues?.some(
            (userInputPscvu: TmaProductSpecCharValueUse) =>
              TmaConfigurablePscInputsDataHandlingService?.comparePscvus(
                userInputPscvu,
                mandatoryPscvu
              )
          )
      );

    let areAllMandatoryPscvusConfigured =
      remainingMandatoryPscvus?.length === 0;

    if (areAllMandatoryPscvusConfigured) {
      areAllMandatoryPscvusConfigured =
        this.latestInputPscvuValues?.filter(
          (userInputPscvu: TmaProductSpecCharValueUse) => {
            const amountOfSelectedPscvs: number =
              userInputPscvu?.productSpecCharacteristicValue?.length;

            return (
              amountOfSelectedPscvs < userInputPscvu?.minCardinality ||
              (userInputPscvu?.maxCardinality &&
                amountOfSelectedPscvs > userInputPscvu?.maxCardinality)
            );
          }
        )?.length === 0;
    }

    this?.errorMessagesMap.set(productCode, !areAllMandatoryPscvusConfigured);
    this?.displayErrorMessageSubject?.next(this?.errorMessagesMap);

    return areAllMandatoryPscvusConfigured;
  }

  /**
   * Clean saved data
   */
  cleanData(): void {
    this.cleanCache();
    this.cleanErrorMessages();
  }

  /**
   * Removes the product and selected pscvs from the map
   * @param productCode which is unselected from the configurable guided selliing page
   */

  removePscvusFromMap(productCode: string): void {
    if (this.pscvusProductMap.size > 0) {
      this.pscvusProductMap.delete(productCode);
    }
  }

  /**
   * Cleans the saved PSCVU values received from user input
   */
  protected cleanCache(): void {
    this.pscvusProductMap?.clear();
  }

  /**
   * Cleans the saved error messages
   */
  protected cleanErrorMessages(): void {
    this?.errorMessagesMap.clear();
    this?.displayErrorMessageSubject?.next(this?.errorMessagesMap);
  }

  /**
   * Saves the configurable pscvus from the current product for future reference
   * @param product which is displayed on the current PDP
   */
  protected saveConfigurablePscvus(product: TmaProduct): void {
    this.mandatoryConfigurablePscvus = product?.poSpecCharValueUses?.filter(
      (pscvu: TmaProductSpecCharValueUse) =>
        (
          pscvu?.minCardinality !== pscvu?.maxCardinality ||
          (pscvu?.minCardinality === 1 && pscvu?.maxCardinality === 1 && pscvu?.productSpecCharacteristicValue[0]?.value === '##')
        ) && pscvu?.minCardinality > 0
    );
  }
}
