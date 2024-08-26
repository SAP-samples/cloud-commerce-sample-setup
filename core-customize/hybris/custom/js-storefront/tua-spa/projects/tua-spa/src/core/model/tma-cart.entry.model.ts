// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Price, Region } from '@spartacus/core';
import { TmaSubscribedProduct, TmaValidationMessage } from './tma-cart.model';
import { Appointment } from './appointment.model';
import { TmaCycle, TmaProcessType } from './tma-common.model';
import { OrderEntry } from '@spartacus/cart/base/root';
import { TmaProduct, TmaProductOfferingPrice } from './tma-product.model';

export enum TmaActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
  KEEP = 'KEEP'
}

export enum TmaBillingTimeType {
  PAY_NOW = 'paynow',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum TmaChargeType {
  ONE_TIME = 'oneTime',
  RECURRING = 'recurring',
  USAGE = 'usage',
}

export enum TmaPriceType {
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  DELIVERY_COST = 'DELIVERY_COST',
  PAYMENT_COST = 'PAYMENT_COST',
  DISCOUNT = 'DISCOUNT',
  DISCOUNT_PRICE_ALTERATION = 'DISCOUNT_PRICE_ALTERATION',
  CREDIT_ALLOWANCE = 'CREDIT_ALLOWANCE'
}

export interface TmaDuration {
  amount?: number;
  units?: string;
}

export interface TmaBillingPlan {
  billingCycleDay?: number;
  billingCycleType?: string;
  billingTime?: string;
  name?: string;
}

export interface TmaSubscriptionTerm {
  billingPlan?: TmaBillingPlan;
  id?: string;
  name?: string;
  duration?: TmaDuration;
  termOfServiceFrequency?: string;
  termOfServiceNumber?: number;
  termOfServiceRenewal?: string;
  cancellable?: boolean;
}

export interface TmaCartPrice {
  id?: string;
  name?: string;
  description?: string;
  priceType?: string;
  recurringChargePeriod?: string;
  chargeType?: string;
  unitOfMeasure?: string;
  dutyFreeAmount?: Price;
  taxIncludedAmount?: Price;
  taxRate?: number;
  cartPrice?: TmaCartPrice[];
  cycle?: TmaCycle;
  tierStart?: string;
  tierEnd?: string;
  childPrices?: TmaChildCartPrice[];
  usageChargeType?: string;
  parentId?: string;
  priceAlteration?: TmaCartPrice[];
  percentage?: string;
  price?: TmaCartPrice;
  productOfferingPrice?: TmaProductOfferingPrice;
}

export interface TmaOrderEntry extends OrderEntry {
  action?: TmaActionType;
  appointmentId?: string;
  appointment?: Appointment;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
  subscriptionTerm?: TmaSubscriptionTerm;
  contractStartDate?: string;
  entryGroupNumbers?: number;
  region?: Region;
  rootBpoCode?: string;
  cartPrice?: TmaCartPrice;
  entries?: TmaOrderEntry[];
  validationMessages?: TmaValidationMessage[];
  entryNumber?: number;
  product?: TmaProduct;
}

export interface TmaChildCartPrice {
  taxIncludedAmount?: TmaTaxIncludedAmount;
  billingTime?: TmaBillingTime;
}

export interface TmaTaxIncludedAmount {
  value?: string;
  currencyIso?: string;
  formattedValue?: string;
}

export interface TmaBillingTime {
  name?: string;
}

export interface TmaCartItemPrice {
  currencyIso: string;
  payOnCheckoutPrice: number;
  payOnCheckoutDiscount: number;
  recurringPrices: TmaCartPrice[];
  usageChargePrices: TmaCartPrice[];
  oneTimeChargePrices: TmaCartPrice[];
}
