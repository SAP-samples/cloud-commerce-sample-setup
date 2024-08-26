// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TimePeriod } from './time-period.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { RelatedPlaceRefOrValue } from './query-service-qualification.model';

export interface SearchTimeSlot {
  id?: string;
  availableTimeSlot?: TimeSlot[];
  searchResult?: string;
  status?: string;
  requestedTimeSlot?: TimeSlot[];
  relatedPlace?: RelatedPlaceRefOrValue;
}

export interface TimeSlot {
  id?: string;
  href?: string;
  relatedParty?: TmaTmfRelatedParty;
  validFor?: TimePeriod;
}
