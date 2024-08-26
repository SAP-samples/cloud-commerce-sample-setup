// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AVAILABILITY_CHECK_FEATURE,
  AvailabilityCheckMap,
  AvailabilityCheckState,
  StateWithAvailabilityCheck
} from '../availability-check.state';
import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { ResourceRef } from '../../../model';

export const getAvailabilityCheckFeatureState: MemoizedSelector<StateWithAvailabilityCheck,
  AvailabilityCheckState> = createFeatureSelector<AvailabilityCheckState>(AVAILABILITY_CHECK_FEATURE);

export const getAvailabilityCheckMap: MemoizedSelector<StateWithAvailabilityCheck,
  AvailabilityCheckMap[]> = createSelector(
  getAvailabilityCheckFeatureState,
  (state: AvailabilityCheckState) => state.appliedCapacityAmountMap
);

export const getLogicalResourceForType: MemoizedSelectorWithProps<StateWithAvailabilityCheck,
  any,
  ResourceRef[]> = createSelector(
  getAvailabilityCheckMap,
  (state: AvailabilityCheckMap[], props: any) => {
    const resources: ResourceRef[] = [];
    state.forEach((availabilityCheckMap: AvailabilityCheckMap) =>
      availabilityCheckMap.appliedCapacityAmount.resource.forEach(
        (logicalResource: ResourceRef) => {
          if (
            logicalResource['@referredType'] === props.type &&
            resources.length <= props.capacityDemandAmount
          ) {
            resources.push(logicalResource);
          }
        }
      )
    );
    return resources;
  }
);

export const getSelectedLogicalResource: MemoizedSelector<StateWithAvailabilityCheck,
  ResourceRef> = createSelector(
  getAvailabilityCheckFeatureState,
  (state: AvailabilityCheckState) => state.selectedLogicalResource
);

export const getAvailabilityCheckError: MemoizedSelector<StateWithAvailabilityCheck,
  string> = createSelector(
  getAvailabilityCheckFeatureState,
  (state: AvailabilityCheckState) => state.availabilityCheckError
);
