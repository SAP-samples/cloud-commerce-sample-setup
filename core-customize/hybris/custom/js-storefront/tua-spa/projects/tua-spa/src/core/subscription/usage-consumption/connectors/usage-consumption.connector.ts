// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsageConsumptionReport } from '../../../model';
import { UsageConsumptionAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root',
})
export class UsageConsumptionConnector {
  constructor(protected adapter: UsageConsumptionAdapter) {}

  public getUsageConsumption(
    baseSiteId: string,
    subscriptionId: string
  ): Observable<UsageConsumptionReport[]> {
    return this.adapter.getUsageConsumption(baseSiteId, subscriptionId);
  }
}
