// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Product } from '@spartacus/core';
import { TmaBillingAccountRef } from './tma-billing-account.model';
import { TmaBillingPlan } from './tma-cart.entry.model';
import { TmaPlace, TmaRelatedParty } from './tma-cart.model';
import { TmaCycle, TmaProcessType, TmaQuantity, TmaTimePeriod } from './tma-common.model';
import { TmaProductPrice } from './tma-price.model';
import { TmaProductOfferingRef, TmaRealizingService } from './tma-product-offering.model';
import { TmaProductOrderRef } from './tma-product-order.model';
import { TmaProductSpecCharValueUse, TmaProductSpecification } from './tma-product-specification.model';
import { TmaRealizingResource } from './tma-resource.model';

export interface TmaProduct extends Product {
  productSpecification?: TmaProductSpecification;
  productOfferingPrice?: TmaProductOfferingPrice[];
  productSpecCharValues?: TmaProductSpecificationCharacteristicValue[];
  children?: TmaProduct[];
  isBundle?: boolean;
  offeringGroup?: TmaProductOfferingGroup[];
  priceContext?: TmaPriceContext[];
  poSpecCharValueUses?: TmaProductSpecCharValueUse[];
  parents?: TmaProductParentBpo[];
}

export interface TmaProductParentBpo {
  code?: string;
  hasParentBpos?: boolean;
  isBundle?: boolean;
  isComponentEditable?: boolean;
  isMaxLimitReachedForBundle?: boolean;
  isRemovableEntry?: boolean;
  preselected?: boolean;
  soldIndividually?: boolean;
}

export interface TmaProductSpecificationCharacteristicValue {
  id?: string;
  unitOfMeasure?: string;
  value?: string;
}

export interface TmaTmfProduct {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  billingAccount?: TmaBillingAccountRef[];
  characteristic?: TmaProductCharacteristic[];
  description?: string;
  href?: string;
  id?: string;
  isBundle?: boolean;
  isCustomerVisible?: boolean;
  name?: string;
  place?: TmaPlace[];
  productOffering?: TmaProductOfferingRef;
  productOrder?: TmaProductOrderRef[];
  productPrice?: TmaProductPrice[];
  productRelationship?: TmaProductRelationship[];
  productSerialNumber?: string;
  productSpecification?: TmaProductSpecification;
  productTerm?: TmaProductTerm[];
  realizingResource?: TmaRealizingResource[];
  realizingService?: TmaRealizingService[];
  relatedParty?: TmaRelatedParty[];
  startDate?: Date;
  status?: TmaStatusType;
  terminationDate?: Date;
}

export enum TmaStatusType {
  CREATED = 'CREATED',
  PENDINGACTIVE = 'PENDINGACTIVE',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  PENDINGTERMINATE = 'PENDINGTERMINATE',
  TERMINATED = 'TERMINATED',
  SUSPENDED = 'SUSPENDED',
  ABORTED = 'ABORTED'
}

export interface TmaProductTerm {
  '@type'?: string;
  description?: string;
  duration?: TmaQuantity;
  name?: string;
  validFor?: TmaTimePeriod;
}

export interface TmaPopRelationship {
  id?: string;
  relationshipType?: string;
}

export interface TmaProductOfferingPrice {
  id?: string;
  name?: string;
  itemType?: string;
  isBundle?: boolean;
  bundledPop?: TmaProductOfferingPrice[];
  isPriceOverride?: boolean;
  processType?: TmaProcessType[];
  productOfferingTerm?: TmaProductOfferingTerm[];
  recurringChargePeriodLength?: number;
  recurringChargePeriodType?: string;
  unitOfMeasure?: TmaMoney;
  price?: TmaMoney;
  billingEvent?: string;
  cycle?: TmaCycle;
  usageType?: string;
  chargeType?: string;
  usageUnit?: TmaUsageUnit;
  tierStart?: number;
  tierEnd?: number;
  region?: TmaRegion[];
  priority?: number;
  isPercentage?: boolean;
  popRelationships?: TmaPopRelationship[];
  alterations?: TmaProductOfferingPrice[];
  href?: string
}

export enum TmaPopRelationshipType {
  DISCOUNTED_BY = 'discountedBy'
}

export enum TmaPopChargeType {
  ONE_TIME = 'oneTime',
  RECURRING = 'recurring',
  USAGE = 'usage',
  DISCOUNT = 'discount',
  ALLOWANCE = 'allowance'
}

export enum TmaPopBillingEventType {
  ON_CANCELLATION = 'oncancellation',
  PAY_NOW = 'paynow',
  ON_FIRST_BILL = 'onfirstbill',
  MONTHLY = 'monthly'
}

export enum TmaUsageType {
  EACH_RESPECTIVE_TIER = 'each_respective_tier',
  HIGHEST_APPLICABLE_TIER = 'highest_applicable_tier'
}

export enum TmaItemType {
  PER_UNIT_USAGE_CHARGE = 'PerUnitUsageCharge',
  VOLUME_USAGE_CHARGE = 'VolumeUsageCharge'
}

export interface TmaProductOfferingTerm {
  id?: string;
  name?: string;
  cancellable?: boolean;
  termOfServiceRenewal?: string;
  termOfServiceNumber?: string;
  termOfServiceFrequency?: string;
  billingPlan?: TmaBillingPlan;
  duration?: TmaQuantity;
}

export interface TmaMoney {
  currencyIso?: string;
  value?: string;
}

export interface TmaUsageUnit {
  id?: string;
  name?: string;
}

export interface TmaRegion {
  isocode?: string;
  isocodeShort?: string;
  countryIso?: string;
  name?: string;
  role?: string;
}

export interface TmaProductOfferingGroup {
  id?: string;
  name?: string;
  childProductOfferings?: TmaProduct[];
}

export interface TmaBillingEvent {
  name?: string;
}

export interface TmaPriceContext {
  id: string;
  name: string;
  isPriceOverride: boolean;
  productOfferingPrice: TmaProductOfferingPrice;
  isBundle: boolean;
  isSellable: boolean;
  productOfferingTerm: TmaProductOfferingTerm[];
  processType: TmaProcessType;
  priority: number;
}

export interface TmaProductRef {
  id?: string;
  href?: string;
  name?: string;
  productOffering?: TmaTmfProduct;
}

export interface TmaProductCharacteristic {
  '@schemaLocation'?: string;
  '@type'?: string;
  name?: string;
  value?: string;
}

export interface TmaPscvuProductCharaceristic {
  productCode?: string;
  name?: string;
  value?: string;
}

export interface TmaProductRelationship {
  type?: string;
  relationshipType?: string;
  product?: TmaProductRef;
}
