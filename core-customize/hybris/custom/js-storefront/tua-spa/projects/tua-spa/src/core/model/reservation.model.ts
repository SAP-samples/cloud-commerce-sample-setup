// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { AppliedCapacityAmount, ResourceCapacityDemand } from './logical-resource.model';

export interface Reservation {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  description?: string;
  href?: string;
  id?: string;
  reservationState?: ReservationStateType;
  reservationItem?: ReservationItem[];
  relatedParty?: TmaTmfRelatedParty[];
  productOffering?: ProductOfferingRef;
}

export interface ProductOfferingRef {
  id?: string;
  name?: string;
  href?: string;
}

export interface ReservationItem {
  quantity?: number;
  subReservationState?: string;
  resourceCapacity?: ResourceCapacityDemand[];
  appliedCapacityAmount?: AppliedCapacityAmount[];
}

export enum ReservationStateType {
  INITIALIZED = 'initialized',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REJECTED = 'rejected',
}
