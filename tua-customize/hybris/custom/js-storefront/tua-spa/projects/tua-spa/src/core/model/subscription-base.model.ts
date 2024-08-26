// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface SubscriptionBase {
  id?: string;
  subscriberIdentity?: string;
  subscriptionAccess?: SubscriptionAccess[];
}

export interface SubscriptionAccess {
  accessType?: AccessType;
  subscriptionBase?: SubscriptionBaseRef;
  relatedParty?: TmaTmfRelatedParty;
}

export interface AccessType {
  value?: string;
}

export interface SubscriptionBaseDetail {
  subscriptionBase?: SubscriptionBaseRef;
  user?: TmaTmfRelatedParty;
}
export interface SubscriptionBaseRef {
  product?: ProductRef[];
  relatedPartyRef?: TmaTmfRelatedParty[];
  id?: string;
  accessType?: string;
}
export interface ProductRef {
  id?: string;
  name?: string;
  href?: string;
  publicIdentifier?: string;
  user?: TmaTmfRelatedParty;
}
