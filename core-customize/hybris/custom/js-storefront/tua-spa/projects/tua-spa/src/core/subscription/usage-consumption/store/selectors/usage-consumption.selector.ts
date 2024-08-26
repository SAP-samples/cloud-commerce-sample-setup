// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { UsageConsumptionReport } from '../../../../model';
import {
  StateWithUsageConsumption,
  USAGE_CONSUMPTION_FEATURE,
  UsageConsumptionMap,
  UsageConsumptionState
} from '../usage-consumption.state';

export const getUsageConsumptionFeatureState: MemoizedSelector<
  StateWithUsageConsumption,
  UsageConsumptionState
> = createFeatureSelector<UsageConsumptionState>(USAGE_CONSUMPTION_FEATURE);

export const getAllUsageConsumption: MemoizedSelector<
  StateWithUsageConsumption,
  UsageConsumptionMap[]
> = createSelector(
  getUsageConsumptionFeatureState,
  (state: UsageConsumptionState) => state.usageConsumptionMap
);

export const getUsageConsumptionForSubscriptionId: MemoizedSelectorWithProps<
  StateWithUsageConsumption,
  any,
  UsageConsumptionReport
> = createSelector(
  getAllUsageConsumption,
  (state: UsageConsumptionMap[], props: any) => {
    const usageConsumption: UsageConsumptionMap = state
      ? state.find(
          (consumption: UsageConsumptionMap) =>
            consumption.baseSiteId === props.baseSiteId &&
            consumption.subscriptionId === props.subscriptionId
        )
      : undefined;
    return usageConsumption ? usageConsumption.usageConsumption : undefined;
  }
);
