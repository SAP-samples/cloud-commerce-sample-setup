// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TimePeriod } from './time-period.model';
import { GeographicAddress } from './geographic-address.model';
import { TmaProduct } from './tma-product.model';
import { TmaSelectionAction } from './tma-guided-selling.model';
import { TmaTechnicalResource } from './tma-premise-details.model';

export interface QueryServiceQualification {
  id?: string;
  href?: string;
  description?: string;
  effectiveQualificationDate?: TimePeriod;
  estimatedResponseDate?: TimePeriod;
  expectedQualificationDate?: TimePeriod;
  expirationDate?: TimePeriod;
  externalId?: string;
  instantSyncQualification?: boolean;
  queryServiceQualificationDate?: TimePeriod;
  searchCriteria: ServiceQualificationItem;
  serviceQualificationItem?: ServiceQualificationItem[];
  state?: string;
  type: string;
  technicalResources?: TmaTechnicalResource[];
  address?: RelatedPlaceRefOrValue[];
  isCategoryPage?: boolean;
}

export interface ServiceQualificationItem {
  id?: string;
  service: ServiceRefOrValue;
  type: string;
}

export interface ServiceRefOrValue {
  place?: RelatedPlaceRefOrValue[];
  serviceSpecification?: ServiceSpecificationRef;
  serviceCharacteristic?: ServiceCharacteristic[];
  serialNumber?: string,
  division?: string,
}

export interface ServiceSpecificationRef {
  id: string;
  href: string;
  name: string;
  type: string;
}

export interface ServiceCharacteristic {
  name: string;
  valueType: string;
  value: any;
}

export interface RelatedPlaceRefOrValue {
  role: string;
  city?: string;
  postcode?: string;
  streetName?: string;
  streetType?: string;
  streetNr?: string;
  country?: string;
  stateOfProvince?: string;
  geographicAddress?: GeographicAddress[];
  '@type'?: string;
}

export interface QualificationBundle {
  product?: TmaProduct;
  action?: TmaSelectionAction;
  qualificationBundleCheck?: boolean
}

