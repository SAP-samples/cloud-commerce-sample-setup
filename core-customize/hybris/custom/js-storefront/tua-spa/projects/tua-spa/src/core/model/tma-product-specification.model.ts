// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTimePeriod } from './tma-common.model';
import { TmaServiceSpecificationRef, TmaUsageSpecificationRef } from './tma-product-offering.model';

export interface TmaBundledProductSpecification {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  href?: string;
  id?: string;
  lifecycleStatus?: string;
  name?: string;
}

export interface TmaProductSpecification {
  id: string;
  name?: string;
  href?: string;
  brand?: string;
  bundledProductSpecification?: TmaBundledProductSpecification[];
  description?: string;
  isBundle?: boolean;
  lastUpdate?: Date;
  lifecycleStatus?: string;
  productNumber?: string;
  productSpecCharacteristic?: TmaProductSpecCharacteristic[];
  productSpecType?: TmaProductSpecType[];
  serviceSpecification?: TmaServiceSpecificationRef[];
  usageSpecification?: TmaUsageSpecificationRef;
  validFor?: TmaTimePeriod;
  version?: string;
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
}

export interface TmaProductSpecCharacteristic {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  '@valueSchemaLocation'?: string;
  configurable?: boolean;
  description?: string;
  extensible?: boolean;
  isUnique?: boolean;
  maxCardinality?: number;
  minCardinality?: number;
  name?: string;
  productSpecCharRelationship?: TmaProductSpecCharRelationship[];
  productSpecCharacteristicValue?: TmaProductSpecCharacteristicValue[];
  regex?: string;
  validFor?: TmaTimePeriod;
  valueType?: string;
}

export interface TmaProductSpecCharRelationship {
  '@type'?: string;
  type?: string;
  charSpecSeq?: number;
  href?: string;
  id?: string;
  name?: string;
  validFor?: TmaTimePeriod;
}

export interface TmaProductSpecCharacteristicValue {
  '@schemaLocation'?: string;
  '@type'?: string;
  id?: string;
  isDefault?: boolean;
  rangeInterval?: string;
  regex?: string;
  unitOfMeasure?: string;
  validFor?: TmaTimePeriod;
  value?: string;
  valueFrom?: string;
  valueTo?: string;
  valueType?: string;
}

export interface TmaProductSpecType {
  description?: string;
  id?: string;
}

export interface TmaProductSpecCharValueUse {
  name?: string;
  description?: string;
  valueType?: string;
  minCardinality?: number;
  maxCardinality?: number;
  validFor?: TmaTimePeriod;
  productSpecCharacteristicValue?: TmaProductSpecCharacteristicValue[];
  productSpecification?: TmaProductSpecificationRef;
}

export interface TmaConfigurablePscvu {
  name?: string;
  description?: string;
  valueType?: string;
  minCardinality?: number;
  maxCardinality?: number;
  validFor?: TmaTimePeriod;
  productCode?: string;
  productSpecCharacteristicValue?: TmaProductSpecCharacteristicValue[];
  productSpecification?: TmaProductSpecificationRef;
}

export interface TmaProductSpecificationRef {
  id?: string;
  href?: string;
  version?: string;
  name?: string;
}
