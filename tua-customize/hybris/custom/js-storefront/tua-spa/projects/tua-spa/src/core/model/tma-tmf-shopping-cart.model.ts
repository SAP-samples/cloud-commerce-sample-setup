// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Appointment } from './appointment.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmfProduct } from './tmf-product.model';
import { TmaCartPrice, TmaSubscriptionTerm } from './tma-cart.entry.model';
import { TmaProcessType } from './tma-common.model';
import { TmaSubscriptions } from './tma-selfcare.model';
import { Tmf } from '../tmf';
import TmfPaymentRef = Tmf.TmfPaymentRef;
import TmfPlace = Tmf.TmfPlace;
import TmfCartTerm = Tmf.TmfCartTerm;

export interface TmaShoppingCartRef {
  href?: string;
  id?: string;
}
export interface TmaTmfShoppingCart {
  id?: string;
  guid?: string;
  href?: string;
  paymentMethod?: TmfPaymentRef[];
  place?: TmfPlace[];
  baseSiteId?: string;
  cartItem?: TmaTmfCartItem[];
  itemTerm?: TmfCartTerm[];
  relatedParty?: TmaTmfRelatedParty[];
}

export interface TmaTmfCartItem {
  '@referredType'?: string;
  id?: string;
  action?: TmaTmfActionType;
  quantity?: number;
  contractStartDate?: string;
  cartItem?: TmaTmfCartItem[];
  productOffering?: TmaTmfProductOffering;
  processType?: TmaProcessType;
  appointment?: Appointment;
  product?: TmfProduct;
  itemTerm?: TmaSubscriptionTerm[];
  subscribedProduct?: TmaSubscriptions;
  cartItemRelationship?: TmaTmfCartItemRelationship[];
}

export interface TmaTmfCartItemRelationship {
  id?: string;
  type?: string;
  cartItem?: TmaTmfCartItem;
  rootBpoCode?: string;
  itemPrice?: TmaCartPrice[]
}

export interface TmaTmfProductOffering {
  id?: string;
  '@referredType'?: string;
}

export enum TmaTmfActionType {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  KEEP = 'KEEP',
  REMOVE = 'REMOVE'
}
