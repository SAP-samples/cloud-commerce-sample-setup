// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaAttachment, TmaExternalIdentifier } from './tma-common.model';
import { LOCAL_STORAGE } from '../util/constants';

const { SCHEMA_LOCATION, REFERRED_TYPE } = LOCAL_STORAGE.AT_TYPES;

export interface TmaServiceSpecificationRef {
  '@baseType'?: string;
  REFERRED_TYPE?: string;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
  externalIdentifier?: TmaExternalIdentifier[];
  href?: string;
  id?: string;
  name?: string;
  targetServiceSchema?: TmaTargetServiceSchema;
  version?: string;
}

export interface TmaTargetServiceSchema {
  '@baseType'?: string;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
}

export interface TmaRealizingService {
  REFERRED_TYPE?: string;
  href?: string;
  id?: string;
  name?: string;
  role?: string;
}

export interface TmaUsageSpecificationRef {
  REFERRED_TYPE?: string;
  externalIdentifier?: TmaExternalIdentifier[];
  href?: string;
  id?: string;
  name?: string;
}

export interface TmaVariantOption {
  id?: string;
  variantCategory?: string;
  variantValue?: string;
}

export interface TmaProductOfferingRef {
  REFERRED_TYPE?: string;
  '@type'?: string;
  href?: string;
  id?: string;
  image?: TmaAttachment;
  name?: string;
  variantOption?: TmaVariantOption[];
}

export interface TmaProductOfferingPriceRef {
  '@baseType'?: string;
  REFERRED_TYPE?: string;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
  href?: string;
  id?: string;
  name?: string;
}
