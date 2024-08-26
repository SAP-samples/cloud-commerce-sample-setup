// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export interface TmaProcessType {
  id: TmaProcessTypeEnum;
  href?: string;
  '@schemaLocation'?: string;
  '@type'?: string;
}

export enum TmaProcessTypeEnum {
  ACQUISITION = 'ACQUISITION',
  DEVICE_ONLY = 'DEVICE_ONLY',
  RETENTION = 'RETENTION',
  SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
  TARIFF_CHANGE = 'TARIFF_CHANGE',
  TERMINATION = 'TERMINATION',
  RENEWAL = 'RENEWAL'
}

export interface TmaQuantity {
  amount?: number;
  units?: string;
}

export interface TmaCycle {
  cycleStart?: number;
  cycleEnd?: number;
}

export interface TmaNote {
  author?: string;
  date?: Date;
  text?: string;
}

export enum TmaPriorityType {
  _0 = '0',
  _1 = '1',
  _2 = '2',
  _3 = '3',
  _4 = '4'
}

export interface TmaChannel {
  '@type'?: string;
  href?: string;
  id?: string;
  name?: string;
  role?: string;
}

export interface TmaTmfMoney {
  unit?: string;
  value?: string;
}

export enum TmaStateType {
  CANCELLING = 'CANCELLING',
  CHECKED_VALID = 'CHECKED_VALID',
  CREATED = 'CREATED',
  OPEN = 'OPEN',
  CHECKED_INVALID = 'CHECKED_INVALID',
  ON_VALIDATION = 'ON_VALIDATION',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
  PAYMENT_AUTHORIZED = 'PAYMENT_AUTHORIZED',
  PENDING_APPROVAL_FROM_MERCHANT = 'PENDING_APPROVAL_FROM_MERCHANT',
  CANCELLED = 'CANCELLED',
  PAYMENT_NOT_AUTHORIZED = 'PAYMENT_NOT_AUTHORIZED',
  PENDING_QUOTE = 'PENDING_QUOTE',
  APPROVED_QUOTE = 'APPROVED_QUOTE',
  PAYMENT_AMOUNT_RESERVED = 'PAYMENT_AMOUNT_RESERVED',
  PAYMENT_AMOUNT_NOT_RESERVED = 'PAYMENT_AMOUNT_NOT_RESERVED',
  REJECTED_QUOTE = 'REJECTED_QUOTE',
  APPROVED = 'APPROVED',
  PAYMENT_CAPTURED = 'PAYMENT_CAPTURED',
  PAYMENT_NOT_CAPTURED = 'PAYMENT_NOT_CAPTURED',
  REJECTED = 'REJECTED',
  APPROVED_BY_MERCHANT = 'APPROVED_BY_MERCHANT',
  FRAUD_CHECKED = 'FRAUD_CHECKED',
  ORDER_SPLIT = 'ORDER_SPLIT',
  REJECTED_BY_MERCHANT = 'REJECTED_BY_MERCHANT',
  ASSIGNED_TO_ADMIN = 'ASSIGNED_TO_ADMIN',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  B2B_PROCESSING_ERROR = 'B2B_PROCESSING_ERROR',
  WAIT_FRAUD_MANUAL_CHECK = 'WAIT_FRAUD_MANUAL_CHECK',
  PAYMENT_NOT_VOIDED = 'PAYMENT_NOT_VOIDED',
  TAX_NOT_VOIDED = 'TAX_NOT_VOIDED',
  TAX_NOT_COMMITTED = 'TAX_NOT_COMMITTED',
  TAX_NOT_REQUOTED = 'TAX_NOT_REQUOTED'
}

export interface TmaExternalIdentifier {
  externalIdentifierType?: string;
  id?: string;
  owner?: string;
}

export interface TmaAttachment {
  '@baseType'?: string;
  '@schemaLocation'?: string;
  description?: string;
  href?: string;
  id?: string;
  mimeType?: string;
  '@type'?: string;
  url?: string;
  validFor?: TmaTimePeriod;
  type?: string;
}

export interface TmaTimePeriod {
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface TmaServiceProviderDetails {
  contractDate?: string,
  processType?: TmaProcessTypeEnum,
  serviceProviderName?: string
}

export enum TmaProductRelationshipType {
  RELY_ON = 'RELY_ON'
}
