// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AppliedCapacityAmount, ResourceCapacityDemand, ResourceRef } from '../../model';

export const AVAILABILITY_CHECK_FEATURE = 'check-availability';
export const AVAILABILITY_CHECK_DATA = '[check-availability] Data';

export interface StateWithAvailabilityCheck {
  [AVAILABILITY_CHECK_DATA]: AvailabilityCheckState;
}

export interface AvailabilityCheckMap {
  resourceCapacityDemand?: ResourceCapacityDemand;
  appliedCapacityAmount?: AppliedCapacityAmount;
}

export interface AvailabilityCheckState {
  selectedLogicalResource?: ResourceRef;
  appliedCapacityAmountMap: AvailabilityCheckMap[];
  availabilityCheckError?: string;
}
