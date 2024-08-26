// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TimePeriod } from '../../model';

export namespace TmfQueryServiceQualificationApiModel {
  export interface TmfQueryServiceQualification {
    id: string;
    href?: string;
    description?: string;
    effectiveQualificationDate?: TimePeriod;
    estimatedResponseDate?: TimePeriod;
    expectedQualificationDate?: TimePeriod;
    expirationDate?: TimePeriod;
    externalId?: string;
    instantSyncQualification?: boolean;
    queryServiceQualificationDate?: TimePeriod;
    searchCriteria: TmfServiceQualificationItem;
    serviceQualificationItem?: TmfServiceQualificationItem[];
    state?: string;
    type: string;
  }
  export interface TmfServiceQualificationItem {
    id: string;
    service: ServiceRefOrValue[];
    type: string;
  }

  export interface ServiceRefOrValue {
    place?: RelatedPlaceRefOrValue[];
    serviceSpecification: TmfServiceSpecificationRef[];
    serviceCharacteristic: TmfServiceCharacteristic[];
  }

  export interface TmfServiceSpecificationRef {
    id: string;
    href: string;
    name: string;
    type: string;
  }

  export interface TmfServiceCharacteristic {
    name: string;
    valueType: string;
    value: any;
  }

  export interface RelatedPlaceRefOrValue {
    role: string;
    type: string;
    city: string;
    postcode: string;
    streetName: string;
    streetType: string;
    streetNr: string;
  }
}
