// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TmaConsumptionConfig } from '../../../../core/config/consumption/config';
import {
  SEPARATOR,
  TmaChecklistActionType,
  TmaConsumptionValue,
  TmaPoSearchByConsumption,
  TmaSliderOption,
} from '../../../../core/model';
import { Store } from '@ngrx/store';
import {
  TmaChecklistActionAction,
  TmaChecklistActionsState,
  TmaConsumptionChangeService
} from '../../../../core';
@Component({
  selector: 'cx-po-search-by-consumption',
  templateUrl: './tma-po-search-by-consumption.component.html',
  styleUrls: ['./tma-po-search-by-consumption.component.scss']
})
export class TmaPoSearchByConsumptionComponent implements OnInit {

  @Input()
  poConsumption: TmaPoSearchByConsumption;

  @Input()
  selectedDivision: string;

  @Output()
  consumptionSelected = new EventEmitter<FormGroup>()

  consumptionOptions: TmaSliderOption[] = [];
  consumption: TmaSliderOption;
  selectedValue: TmaSliderOption;

  consumptionForm: FormGroup = this.fb.group({
    consumptionInput: [null, Validators.required]
  });

  constructor(
    protected fb: FormBuilder,
    protected consumptionConfig: TmaConsumptionConfig,
    protected store: Store<TmaChecklistActionsState>,
    protected consumptionChangeService: TmaConsumptionChangeService
  ) {
  }

  ngOnInit(): void {
    this.createConsumptionOptionList();

    this.consumption = this.getConsumption(this.poConsumption.productSpecification.id, this.poConsumption.usageUnit.id);
    this.selectedValue = this.consumption;
    this.consumptionForm['controls'].consumptionInput.setValue(this.consumption);
    this.consumptionSelected.emit(this.consumptionForm);
    this.store.dispatch(
      new TmaChecklistActionAction.ChecklistActionDetails(
        [{ type: TmaChecklistActionType.ESTIMATED_CONSUMPTION, value: { division: this.selectedDivision, consumption: JSON.stringify(this.consumption) } }]
      )
    );
  }

  /**
   * Stores the new consumption value.
   */
  saveConsumption() {
    localStorage.setItem('consumption' + SEPARATOR + this.poConsumption.productSpecification.id + SEPARATOR + this.poConsumption.usageUnit.id, JSON.stringify(this.getConsumptionInput()));
    this.consumptionChangeService.updateConsumption({ consumption: this.getConsumptionInput(), productSpecification: this.poConsumption.productSpecification.id });
    this.consumptionSelected.emit(this.consumptionForm);
    this.store.dispatch(
      new TmaChecklistActionAction.ChecklistActionDetails(
        [{ type: TmaChecklistActionType.ESTIMATED_CONSUMPTION, value: { division: this.selectedDivision, consumption: JSON.stringify(this.getConsumptionInput()) } }]
      )
    );
  }

  protected createConsumptionOptionList() {
    const consumptionOptionsMap = new Map(Object.entries(this.poConsumption.sliderOptionComponents));

    consumptionOptionsMap.forEach((value) => {
      const option: TmaSliderOption = {
        uid: value.uid,
        name: value.name,
        value: Number(value.value)
      };
      this.consumptionOptions.push(option);
    });

    this.consumptionOptions.sort((a, b) => (Number(a.value) > Number(b.value)) ? 1 : -1);
  }

  protected getConsumptionInput(): TmaSliderOption {
    this.consumption = this.consumptionForm['controls'].consumptionInput.value;
    this.selectedValue = this.consumption;
    return this.consumptionForm['controls'].consumptionInput.value;
  }

  protected getConsumption(productSpecification: string, usageUnit: string): TmaSliderOption {
    const consumptionFromLocalStorage = JSON.parse(localStorage.getItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit));

    if (consumptionFromLocalStorage) {
      return consumptionFromLocalStorage;
    }

    const defaultConsumptionValue =
      this.consumptionConfig.consumption.defaultValues.find(
        (consumptionValue: TmaConsumptionValue) => consumptionValue.productSpecification === productSpecification && consumptionValue.usageUnit === usageUnit
      );
    if (!defaultConsumptionValue) {
      const consumptionValue = this.consumptionConfig.consumption.default;
      localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, JSON.stringify(consumptionValue));
      return consumptionValue;
    }

    localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, JSON.stringify(defaultConsumptionValue.consumptionOption));
    return defaultConsumptionValue.consumptionOption;
  }
}
