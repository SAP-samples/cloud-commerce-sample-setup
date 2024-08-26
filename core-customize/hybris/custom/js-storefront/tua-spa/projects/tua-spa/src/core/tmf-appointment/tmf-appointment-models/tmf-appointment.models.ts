// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export namespace TmfAppointmentApiModel {
  export interface TmfSearchTimeSlot {
    id?: string;
    availableTimeSlot?: TmfTimeSlot[];
    searchResult?: string;
    status?: string;
    requestedTimeSlot?: TmfTimeSlot[];
  }

  export interface TmfTimeSlot {
    id?: string;
    href?: string;
    relatedParty?: TmfRelatedParty;
    validFor?: TmfTimePeriod;
  }

  export interface TmfTimePeriod {
    startDateTime: Date;
    endDateTime: Date;
  }

  export interface TmfRelatedParty {
    id: string;
    href?: string;
    role?: string;
    name?: string;
  }

  export interface TmfAppointment {
    id?: string;
    href?: string;
    category?: string;
    creationTime?: Date;
    description?: string;
    externalId?: string;
    lastUpdate?: Date;
    status?: TmfAppointmentStateType;
    validFor?: TmfTimePeriod;
    relatedParty?: TmfRelatedParty[];
  }

  export enum TmfAppointmentStateType {
    INITIALIZED = 'INITIALIZED',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
  }
}
