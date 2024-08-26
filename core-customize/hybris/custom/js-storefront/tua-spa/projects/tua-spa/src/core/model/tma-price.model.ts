// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaCycle, TmaPriorityType, TmaTmfMoney } from './tma-common.model';
import { TmaProductOfferingPriceRef } from './tma-product-offering.model';
import { TmaBillingAccountRef } from './tma-billing-account.model';
import { LOCAL_STORAGE } from '../util/constants';

const { SCHEMA_LOCATION } = LOCAL_STORAGE.AT_TYPES;

export interface TmaPriceAlteration {
  '@baseType'?: string;
  SCHEMA_LOCATION?: string;
  '@type'?: string;
  applicationDuration?: number;
  cycle?: TmaCycle;
  description?: string;
  name?: string;
  price?: TmaPrice;
  priceType?: string;
  priority?: TmaPriorityType;
  productOfferingPrice?: TmaProductOfferingPriceRef;
  recurringChargePeriod?: TmaRecurringChargePeriod;
  unitOfMeasure?: string;
}

export interface TmaPrice {
  SCHEMA_LOCATION?: string;
  '@type'?: string;
  dutyFreeAmount?: TmaTmfMoney;
  percentage?: number;
  taxIncludedAmount?: TmaTmfMoney;
  taxRate?: number;
}

export interface TmaProductPrice {
  SCHEMA_LOCATION?: string;
  '@type'?: string;
  billingAccount?: TmaBillingAccountRef;
  description?: string;
  id?: string;
  name?: string;
  price?: TmaPrice;
  priceType?: string;
  prodPriceAlteration?: TmaPriceAlteration;
  recurringChargePeriod?: TmaRecurringChargePeriod;
  unitOfMeasure?: string;
}

export enum TmaRecurringChargePeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  PAY_NOW = 'paynow',
  ON_FIRST_BILL = 'onfirstbill',
  ON_CANCELATION = 'oncancellation'
}
