// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { QualificationBundle, TmaProduct, TmaSelectionAction } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaGuidedSellingCurrentSelectionsService {

  protected currentSelections: TmaProduct[];
  protected _shouldRemoveCurrentSelections: boolean;

  protected _selection = new Subject<QualificationBundle>();
  protected _selection$: Observable<QualificationBundle> = this._selection.asObservable();

  validateCurrentSelection$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.currentSelections = [];
    this._shouldRemoveCurrentSelections = true;
  }

  /**
   * Adds/removes a new selection to the current selection.
   *
   * @param product - The product offering to be added/removed from the current selection
   * @param action - The action which indicates if the product offering is added or removed from the current selection
   * @param qualificationBundleCheck - The qualificationBundle check API triggers based on this boolean by default it would be true, becomes false only on resetting selection
   */
  changeSelection(product: TmaProduct, action: TmaSelectionAction, qualificationBundleCheck?: boolean): void {
    let selectionAction: TmaSelectionAction;
    if (action === TmaSelectionAction.ADD) {
      selectionAction = TmaSelectionAction.ADD;
      this.addToCurrentSelections(product);
    } else if (action === TmaSelectionAction.KEEP) {
      selectionAction = TmaSelectionAction.KEEP;
      this.addToCurrentSelections(product);
    } else {
      selectionAction = TmaSelectionAction.REMOVE;
      this.removeFromCurrentSelections(product);
    }
    this._selection.next({ product: product, action: selectionAction, qualificationBundleCheck: qualificationBundleCheck === undefined ? true : qualificationBundleCheck });
  }

  /**
   * Returns the list of the current selections.
   *
   * @return List of {@link TmaProduct}
   */
  getCurrentSelections(): TmaProduct[] {
    return this.currentSelections;
  }

  /**
   * Clears the current selection list.
   */
  clearCurrentSelections(): void {
    this.currentSelections.forEach((currentSelection: TmaProduct) => {
      this.changeSelection(currentSelection, TmaSelectionAction.REMOVE, false);
    });
  }

  protected addToCurrentSelections(product: TmaProduct): void {
    this.currentSelections.push(product);
  }

  protected removeFromCurrentSelections(product: TmaProduct): void {
    this.currentSelections = this.currentSelections.filter((prod: TmaProduct) => prod.code !== product.code);
  }

  get selection$(): Observable<QualificationBundle> {
    return this._selection$;
  }

  get shouldRemoveCurrentSelections(): boolean {
    return this._shouldRemoveCurrentSelections;
  }

  set shouldRemoveCurrentSelections(shouldRemoveCurrentSelections: boolean) {
    this._shouldRemoveCurrentSelections = shouldRemoveCurrentSelections;
  }
}
