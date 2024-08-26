// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmaTmfProductOffering } from './tma-tmf-shopping-cart.model';
import { RelatedPlaceRef } from './appointment.model';
import { ProductRef } from './subscription-base.model';
import { TmaProductOfferingPrice } from './tma-product.model';

export interface TmfProduct {
  id?: string;
  name?: string;
  bundleProductCode?: string;
  startDate?: Date;
  status?: TmfProductStatus;
  isBundle?: boolean;
  isCustomerVisible?: boolean;
  terminationDate?: Date;
  relatedParty?: TmaTmfRelatedParty[];
  productOrderItem?: TmfProductOrder[];
  productRelationship?: TmfProductRelationship[];
  place?: RelatedPlaceRef[];
  characteristic?: TmfProductCharacteristic[];
  productOffering?: TmaTmfProductOffering;
  productOfferingPrice?: TmaProductOfferingPrice[];
}

export enum TmfProductStatus {
  created = 'created',
  pendingActive = 'pendingActive',
  cancelled = 'cancelled',
  active = 'active',
  pendingTerminate = 'pendingTerminate',
  terminated = 'terminated',
  suspended = 'suspended',
  aborted = 'aborted',
}

export enum TmfProductRelatedPartyRole {
  OWNER = 'OWNER',
  ADMINISTRATOR = 'ADMINISTRATOR',
  BENEFICIARY = 'BENEFICIARY',
}

export interface TmfProductRelationship {
  id?: string;
  name?: string;
  href?: string;
  type?: string;
  product?: ProductRef;
  publicIdentifier?: string;
  user?: TmaTmfRelatedParty;
}

export interface TmfProductOrder {
  id?: string;
  productOrderId?: string;
  orderItemId?: string;
}

export interface TmfProductCharacteristic {
  id?: string;
  name: string;
  value: string;
}

export enum TmfProductOfferingType {
  OPERATIONAL_PRODUCT_OFFERING = 'OperationalProductOffering'
}
