// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Country, PaymentDetails, Region } from '@spartacus/core';
import { TmaActionType, TmaCartPrice, TmaOrderEntry, TmaSubscriptionTerm } from './tma-cart.entry.model';
import { TmaProcessType, TmaTimePeriod } from './tma-common.model';
import { Cart, CartModification, OrderEntry } from '@spartacus/cart/base/root';
import { TmaProductPrice } from './tma-price.model';
import { TmaProduct, TmaProductRelationship } from './tma-product.model';
import { Appointment } from './appointment.model';

export interface TmaCartModification extends CartModification {
  deliveryModeChanged?: boolean;
  entry?: TmaOrderEntry;
  quantity?: number;
  quantityAdded?: number;
  statusCode?: string;
  statusMessage?: string;
  contractStartDate?: string;
  processType?: TmaProcessType;
  subscribedProduct?: TmaSubscribedProduct;
}

export enum TmaRelatedPartyRole {
  SERVICE_PROVIDER = 'SERVICE_PROVIDER'
}

export enum TmaPlaceRole {
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS'
}

export interface TmaCharacteristic {
  name?: string;
  value?: string;
}

export interface TmaSubscribedProduct {
  id?: string;
  name?: string;
  relatedParty?: TmaRelatedParty[];
  place?: TmaPlace[];
  characteristic?: TmaCharacteristic[];
  productPrice?: TmaProductPrice;
  productRelationship?: TmaProductRelationship[];
}

export interface TmaRelatedParty {
  id?: string;
  role?: TmaRelatedPartyRole;
  '@referredType'?: string;
  href?: string;
  name?: string;
  validFor?: TmaTimePeriod;
}

export interface TmaPlace {
  id?: string;
  name?: string;
  role?: TmaPlaceRole;
  line1?: string;
  line2?: string;
  town?: string;
  postalCode?: string;
  region?: Region;
  country?: Country;
  '@referredType'?: string;
  '@schemaLocation'?: string;
  href?: string;
}

export interface TmaCart extends Cart {
  entries?: TmaOrderEntry[];
  cartCosts?: TmaCartPrice[];
  rootGroups?: TmaRootGroup[];
  message?: TmaMessage[];
}

export interface TmaCartTotalPrice {
  currencyIso: string;
  payOnCheckoutSubTotal: number;
  payOnCheckoutTotal: number;
  deliveryCost: number;
}

export interface TmaRootGroup {
  groupNumber?: number;
  validationMessages?: TmaValidationMessage[];
}

export interface TmaValidationMessage {
  code?: string;
  message?: string;
}

export interface TmaMessage {
  type?: string;
  value?: string;
}

export enum TmaValidationMessageType {
  COMPATIBILITY = 'COMPATIBILITY'
}

export interface TmaPaymentDetails extends PaymentDetails {
  name?: string,
  description?: string,
  type?: string,
  relatedParty?: TmaRelatedParty
}
