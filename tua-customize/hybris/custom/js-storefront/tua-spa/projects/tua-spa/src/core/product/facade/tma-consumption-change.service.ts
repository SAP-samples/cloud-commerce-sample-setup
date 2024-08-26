// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmaConsumptionChangeService {
  protected _consumption = new Subject<{ consumption: number; productSpecification: string }>();
  consumption$ = this._consumption.asObservable();

  constructor() {
  }

  updateConsumption({ consumption: number, productSpecification: string }) {
    this._consumption.next({ consumption: number, productSpecification: string });
  }
}
