// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TmaGuidedSellingStepConfiguration } from '../../model/tma-guided-selling.model';
import { TmfProductCharacteristic } from '../../model/tmf-product.model';

@Injectable({
  providedIn: 'root'
})
export class TmaGuidedSellingProductConfigSelectionsService {

  protected stepConfigs: TmaGuidedSellingStepConfiguration[];

  protected configSelection: Subject<any> = new Subject();
  protected _configSelection$: Observable<any> = this.configSelection.asObservable();

  constructor() {
    this.stepConfigs = [];
  }

  addConfig(stepId: string, characterstics: TmfProductCharacteristic[], product: string) {
    let stepConfig = this.stepConfigs.find(config => config.stepId === stepId);

    if (!stepConfig || stepConfig.product !== product) {
      stepConfig = {stepId: stepId, product, configSelections: characterstics};
      this.stepConfigs.push(stepConfig);
    } else {
      stepConfig.configSelections = characterstics;
    }
    this.configSelection.next({});
  }

  removeConfig(stepId: string, product: string) {
    const stepConfig = this.stepConfigs.find(config => config.stepId === stepId);

    if (stepConfig && stepConfig.product === product) {
      stepConfig.configSelections = [];
    }
    this.configSelection.next({});
  }

  clearStepConfigs() {
    this.stepConfigs = [];
  }

  getStepConfigs(): TmaGuidedSellingStepConfiguration[] {
    return this.stepConfigs;
  }
}
