// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { UsageConsumptionReport } from '../../../model';

export const USAGE_CONSUMPTION_FEATURE = 'usage-consumption';

export interface StateWithUsageConsumption {
  [USAGE_CONSUMPTION_FEATURE]: UsageConsumptionState;
}
export class UsageConsumptionMap {
  baseSiteId: string;
  subscriptionId: string;
  usageConsumption: UsageConsumptionReport;
}

export interface UsageConsumptionState {
  usageConsumptionMap: UsageConsumptionMap[];
}
