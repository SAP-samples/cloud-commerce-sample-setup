// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { LOCAL_STORAGE } from '../util/constants';

const { SCHEMA_LOCATION, REFERRED_TYPE } = LOCAL_STORAGE.AT_TYPES;

export interface SpiProduct {
  id?: string;
  href?: string;
  name?: string;
  description?: string;
  isCustomerVisible?: boolean;
  isBundle?: boolean;
  orderDate?: Date;
  productSerialNumber?: string;
  startDate?: Date;
  terminationDate?: Date;
  status?: SpiProductStatusType;
  billingAccount?: SpiBillingAccount;
  productOffering?: SpiProductOffering;
  productOrderItem?: SpiProductOrderItem[];
  productPrice?: SpiProductPrice[];
  productTerm?: SpiProductTerm[];
  relatedParty?: TmaTmfRelatedParty[];
  SCHEMA_LOCATION?: string;
  '@type'?: string;
}

export interface SpiBillingAccount {
  id?: string;
  href?: string;
  name?: string;
  SCHEMA_LOCATION?: string;
  REFERRED_TYPE?: string;
}

export enum SpiProductStatusType {
  CREATED = 'created',
  CANCELLED = 'cancelled',
  PENDING_ACTIVE = 'pending_active',
  ACTIVE = 'active',
  PENDINGTERMINATE = 'pendingterminate',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
  ABORTED = 'aborted'
}

export interface SpiProductOffering {
  id?: string;
  href?: string;
  name?: string;
  SCHEMA_LOCATION?: string;
  REFERRED_TYPE?: string;
}
export interface SpiProductTerm {
  description?: string;
  name?: string;
  validFor?: ValidFor;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
}
export interface ValidFor {
  endDateTime?: Date;
  startDateTime?: Date;
}

export interface SpiProductOrderItem {
  orderItemAction?: string;
  orderItemId?: string;
  productOrderHref?: string;
  productOrderId?: string;
  role?: string;
  SCHEMA_LOCATION?: string;
  REFERRED_TYPE?: string;
}

export interface SpiProductPrice {
  applicationDuration?: number;
  name?: string;
  priceType?: string;
  priority?: number;
  recurringChargePeriod?: string;
  billingAccount?: SpiBillingAccount;
  price?: SpiPrice;
  productPriceAlteration?: SpiProductPrice[];
  productOfferingPrice?: SpiProductOfferingPrice;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
}

export interface SpiPrice {
  percentage?: number;
  taxRate?: string;
  dutyFreeAmount?: Amount;
  taxIncludedAmount?: Amount;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
}

export interface Amount {
  unit?: string;
  value?: string;
}

export interface SpiProductOfferingPrice {
  id?: string;
  href?: string;
  name?: string;
  SCHEMA_LOCATION?: string;
  REFERRED_TYPE?: string;
}
