// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { TmaConfigurablePscInputsDataHandlingService } from '../../../../../core/configurable-pscv/services';
import { TmaConfigurablePscvu, TmaProductSpecCharacteristicValue, TmaProductSpecCharValueUse } from '../../../../../core/model';

@Component({
  selector: 'cx-tma-multiple-selection-configurable-pscvu',
  templateUrl: './tma-multiple-selection-configurable-pscvu.component.html',
  styleUrls: ['./tma-multiple-selection-configurable-pscvu.component.scss']
})
export class TmaMultipleSelectionConfigurablePscvuComponent implements OnInit {
  @Input()
  pscvu: TmaProductSpecCharValueUse;

  @Input()
  productCode: string;

  id: string;
  isSelected = false;

  subject: Subject<TmaConfigurablePscvu> = new Subject<TmaConfigurablePscvu>();

  constructor(
    public configurablePscvusService: TmaConfigurablePscInputsDataHandlingService
  ) {
  }

  ngOnInit(): void {
    this.configurablePscvusService.addInputObservable(this.subject);

    this.id =
      this.pscvu.name +
      this.pscvu.valueType +
      (this.pscvu.productSpecification.name
        ? this.pscvu.productSpecification.name
        : Date.now().toString());
    this.id = this.id
      .split(' ')
      .reduce(
        (previousValue: string, currentValue: string) =>
          previousValue + '_' + currentValue
      );
  }

  /**
   * Get error message for specific product
   * @productCode Product Code
   */
  isAnyError(productCode: string): boolean {
    let error: boolean;
    this.configurablePscvusService.displayErrorMessage$.subscribe(
      (errorMap) => {
        error = errorMap.get(productCode);
      }
    );
    return error ? error : false;
  }

  /**
   * Builds a PSCVU from the user input and updates the Subject with the new value
   * @param inputValue received from user input
   */
  sendMultipleSelectionInput(): void {
    const htmlElement: HTMLSelectElement =
      document.querySelector<HTMLSelectElement>('#'.concat(this.id));

    const pscvuCopy: TmaConfigurablePscvu = Object.assign({}, this.pscvu);

    pscvuCopy.productCode = this.productCode;

    pscvuCopy.productSpecCharacteristicValue = [];

    for (let i = 0; i < htmlElement.selectedOptions.length; i++) {
      const userSelection = htmlElement.selectedOptions.item(i).value;
      pscvuCopy.productSpecCharacteristicValue[i] =
        this.pscvu.productSpecCharacteristicValue.find(
          (pscv: TmaProductSpecCharacteristicValue) =>
            pscv.value.toLowerCase() === userSelection.toLowerCase()
        );
    }

    if (
      pscvuCopy.productSpecCharacteristicValue.length > 0 &&
      pscvuCopy.productSpecCharacteristicValue.length >=
      this.pscvu.minCardinality &&
      pscvuCopy.productSpecCharacteristicValue.length <=
      (this.pscvu.maxCardinality !== undefined
        ? this.pscvu.maxCardinality
        : this.pscvu.productSpecCharacteristicValue.length)
    ) {
      this.subject.next(pscvuCopy);
      this.isSelected = true;
    } else {
      this.subject.next(undefined);
      this.isSelected = false;
    }
  }
}
