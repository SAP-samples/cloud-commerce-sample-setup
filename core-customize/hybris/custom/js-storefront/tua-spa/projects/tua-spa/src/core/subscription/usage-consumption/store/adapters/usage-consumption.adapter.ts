// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { UsageConsumptionReport } from '../../../../model';

export abstract class UsageConsumptionAdapter {
  /**
   * Abstract method used to get the usage consumption
   * @param baseSiteId The identifier of the base site
   * @param subscriptionId The identifier of the subscription
   * @returns Observable of UsageConsumption
   */
  abstract getUsageConsumption(
    baseSiteId: string,
    subscriptionId: string
  ): Observable<UsageConsumptionReport[]>;
}
