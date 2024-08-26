// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';

export interface Resource {
  type?: LogicalResourceType;
  baseType?: ResourceType;
  relatedParty?: TmaTmfRelatedParty;
}

export interface LogicalResource extends Resource {
  value?: string;
}

export enum LogicalResourceType {
  MSISDN = 'MSISDN',
}

export enum ResourceType {
  LOGICAL_RESOURCE = 'LOGICAL_RESOURCE',
}

export interface ResourceCapacityDemand {
  capacityDemandAmount: number;
  type: string;
}

export interface AppliedCapacityAmount {
  appliedCapacityAmount: number;
  type?: string;
  baseType?: string;
  resource: ResourceRef[];
}

export interface ResourceRef {
  id: string;
  href?: string;
  value: string;
  type?: string;
  '@referredType'?: string;
}
