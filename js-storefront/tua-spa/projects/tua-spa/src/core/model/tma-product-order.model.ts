// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaShoppingCartRef } from './tma-tmf-shopping-cart.model';
import { TmaChannel, TmaNote, TmaPriorityType, TmaProcessType, TmaQuantity, TmaStateType } from './tma-common.model';
import { TmaBillingAccountRef } from './tma-billing-account.model';
import { TmaDeliveryModeRef } from './tma-delivery.model';
import { TmaPrice, TmaPriceAlteration, TmaRecurringChargePeriod } from './tma-price.model';
import { TmaPaymentRef } from './tma-payment.model';
import { TmaPromotionRef } from './tma-promotion.model';
import { TmaAppointmentRef } from './appointment.model';
import { TmaTmfProduct } from './tma-product.model';
import { TmaProductOfferingPriceRef, TmaProductOfferingRef } from './tma-product-offering.model';
import { TmaPlace, TmaRelatedParty } from './tma-cart.model';
import { TmaPriceType } from './tma-cart.entry.model';

export interface TmaProductOrder {
  id?: string;
  '@baseType'?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
  baseSiteId?: string;
  category?: string;
  completionDate?: Date;
  description?: string;
  expectedCompletionDate?: Date;
  externalId?: string;
  href?: string;
  priority?: TmaPriorityType;
  orderDate?: Date;
  notificationContact?: string;
  requestedCompletionDate?: Date;
  requestedStartDate?: Date;
  state?: TmaStateType;
  billingAccount?: TmaBillingAccountRef;
  channel?: TmaChannel[];
  deliveryMode?: TmaDeliveryModeRef;
  note?: TmaNote[];
  orderCost?: TmaOrderPrice[];
  orderItem?: TmaOrderItem[];
  orderTotalPrice?: TmaOrderPrice[];
  payment?: TmaPaymentRef[];
  place?: TmaPlace[];
  promotion?: TmaPromotionRef[];
  relatedParty?: TmaRelatedParty[];
  shoppingCart?: TmaShoppingCartRef;
}

export interface TmaOrderPrice {
  id?: string;
  name?: string;
  description?: string;
  unitOfMeasure?: string;
  recurringChargePeriod?: TmaRecurringChargePeriod;
  usageChargeType?: string;
  priceType?: TmaPriceType;
  price?: TmaPrice;
  priceAlteration?: TmaPriceAlteration[];
  billingAccount?: TmaBillingAccountRef;
  orderPrice?: TmaOrderPrice[];
  productOfferingPrice?: TmaProductOfferingPriceRef;
  '@type'?: string;
  '@baseType'?: string;
  '@schemaLocation'?: string;
}

export interface TmaPaginatedProductOrder {
  orders?: TmaProductOrder[];
  totalCount?: number;
}

export interface TmaProductOrderRef {
  '@referredType'?: string;
  href?: string;
  id?: string;
  orderItemAction?: string;
  orderItemId?: string;
}

export interface TmaOrderItem {
  id?: string;
  action?: string;
  appointment?: TmaAppointmentRef;
  billingAccount?: TmaBillingAccountRef;
  contractStartDate?: Date;
  itemPrice?: TmaOrderPrice[];
  itemTerm?: TmaOrderTerm[];
  itemTotalPrice?: TmaOrderPrice[];
  orderItem?: TmaOrderItem[];
  orderItemRelationship?: TmaOrderItemRelationship[];
  payment?: TmaPaymentRef[];
  processType?: TmaProcessType;
  product?: TmaTmfProduct;
  productOffering?: TmaProductOfferingRef;
  promotion?: TmaPromotionRef[];
  qualification?: TmaQualificationRef[];
  quantity?: number;
  state?: TmaStateType;
  '@schemaLocation'?: string;
  '@type'?: string;
}

export interface TmaQualificationRef {
  '@referredType'?: string;
  href?: string;
  id?: string;
  qualificationItemId?: string;
}

export interface TmaOrderItemRelationship {
  id?: string;
  '@type'?: string;
}

export interface TmaOrderTerm {
  '@type'?: string;
  description?: string;
  duration?: TmaQuantity;
  name?: string;
}
