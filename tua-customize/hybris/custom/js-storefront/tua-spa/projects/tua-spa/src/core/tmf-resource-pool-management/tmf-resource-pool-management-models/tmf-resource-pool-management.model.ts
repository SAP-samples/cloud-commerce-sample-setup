// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export namespace TmfLogicalResource {
  export interface TmfAppliedCapacityAmount {
    appliedCapacityAmount: number;
    type?: string;
    baseType?: string;
    resource: TmfResourceRef[];
  }

  export interface TmfReservation {
    baseType: string;
    schemaLocation: string;
    type: string;
    description: string;
    href: string;
    id: string;
    reservationState: string;
    validFor: TmfValidDate;
    reservationItem: TmfReservationItem[];
    relatedParty: TmfRelatedParty;
  }

  export interface TmfValidDate {
    startDate: Date;
    endDate: Date;
  }

  export interface Reservation {
    baseType?: string;
    schemaLocation?: string;
    type?: string;
    description?: string;
    href?: string;
    id?: string;
    reservationState?: TmfReservationStateType;
    reservationItem?: TmfReservationItem[];
    relatedParty?: TmfRelatedParty[];
    productOffering?: ProductOfferingRef;
  }

  export interface ProductOfferingRef {
    id?: string;
    name?: string;
    href?: string;
  }

  export interface TmfReservationItem {
    quantity?: number;
    subReservationState?: string;
    resourceCapacity?: TmfResourceCapacityDemand[];
    appliedCapacityAmount?: TmfAppliedCapacityAmount[];
  }

  export enum TmfReservationStateType {
    INITIALIZED = 'initialized',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REJECTED = 'rejected',
  }
}

export interface TmfResourceCapacityDemand {
  capacityDemandAmount: number;
  type: string;
}

export interface TmfResourceRef {
  id: string;
  href?: string;
  value: string;
  type?: string;
  referredType: string;
}

export interface TmfRelatedParty {
  id: string;
  href?: string;
  role?: string;
  name?: string;
}
