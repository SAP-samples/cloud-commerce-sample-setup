// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Subject } from 'rxjs';
import { TmaConfigurablePscInputsDataHandlingService } from '../../../../../core/configurable-pscv/services';
import { TmaConfigurablePscvu, TmaProductSpecCharValueUse } from '../../../../../core/model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cx-tma-date-configurable-pscvu',
  templateUrl: './tma-date-configurable-pscvu.component.html'
})
export class TmaDateConfigurablePscvuComponent implements OnInit {
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
  sendDateInput(): void {
    const userInput: Date = document.querySelector<HTMLInputElement>(
      '#'.concat(this.id)
    ).valueAsDate;

    if (userInput) {
      const pscvuCopy: TmaConfigurablePscvu = Object.assign({}, this.pscvu);

      pscvuCopy.productCode = this.productCode;

      pscvuCopy.productSpecCharacteristicValue = [
        {
          '@schemaLocation':
            this?.pscvu?.productSpecCharacteristicValue[0]['@schemaLocation'],
          '@type': this?.pscvu?.productSpecCharacteristicValue[0]['@type'],
          isDefault: this?.pscvu?.productSpecCharacteristicValue[0]?.isDefault,
          rangeInterval:
          this?.pscvu?.productSpecCharacteristicValue[0]?.rangeInterval,
          regex: this?.pscvu?.productSpecCharacteristicValue[0]?.regex,
          unitOfMeasure:
          this?.pscvu?.productSpecCharacteristicValue[0]?.unitOfMeasure,
          validFor: this?.pscvu?.productSpecCharacteristicValue[0]?.validFor,
          valueFrom: this?.pscvu?.productSpecCharacteristicValue[0]?.valueFrom,
          valueTo: this?.pscvu?.productSpecCharacteristicValue[0]?.valueTo,
          valueType: this?.pscvu?.productSpecCharacteristicValue[0]?.valueType,

          value: userInput.toISOString()
        }
      ];

      this.subject.next(pscvuCopy);
      this.isSelected = true;
    } else {
      this.subject.next(undefined);
      this.isSelected = false;
    }
  }
}
