// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AttachmentRef, ContactMedium, RelatedPlaceRef } from './appointment.model';
import { Amount, SpiBillingAccount, SpiProductOffering, ValidFor } from './spi-product.model';
import { ProductRef } from './subscription-base.model';
import { TimePeriod } from './time-period.model';
import { TmaBillingAccountRef } from './tma-billing-account.model';
import { TmaTmfMoney } from './tma-common.model';
import { TmaProductSpecificationRef } from './tma-product-specification.model';
import {
  TmaProductCharacteristic,
  TmaProductOfferingPrice,
  TmaProductOfferingTerm,
  TmaProductRelationship
} from './tma-product.model';
import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { TmaPaymentRef } from './tma-payment.model';
import { LOCAL_STORAGE } from '../util/constants';

const { SCHEMA_LOCATION } = LOCAL_STORAGE.AT_TYPES;

export interface TmaAgreeement {
  id: string;
  href?: string;
  agreementId?: string;
  name?: string;
}

export interface TmaProductOrderItem {
  orderItemAction?: string;
  orderItemId?: string;
  productOrderHref?: string;
  productOrderId?: string;
  role?: string;
  SCHEMA_LOCATION?: string;
  '@referredType'?: string;
}

export interface TmaSubscriptions {
  id?: string;
  href?: string;
  description?: string;
  isBundle?: boolean;
  isCustomerVisible?: boolean;
  name?: string;
  orderDate?: Date;
  productSerialNumber?: string;
  startDate?: Date;
  terminationDate?: Date;
  agreement?: TmaAgreeement[];
  billingAccount?: TmaBillingAccountRef;
  product?: ProductRef[];
  productCharacteristic?: TmaProductCharacteristic[];
  productOffering?: TmaBillingAccountRef;
  productOrderItem?: TmaProductOrderItem[];
  productPrice?: TmaProductOfferingPrice;
  productRelationship?: TmaProductRelationship;
  productSpecification?: TmaProductSpecificationRef;
  productTerm?: TmaProductOfferingTerm[];
  relatedParty?: TmaTmfRelatedParty[];
  status?: string;
  place?: RelatedPlaceRef[];
}

export interface TmaSubscribedProductsInventory {
  subscribedProducts: TmaSubscriptions[];
  childrens: TmaSubscriptions[];
}

export interface TmaSubscriptionsTreeNode extends TmaSubscriptions {
  expanded: boolean;
  depthLevel: number;
  count: number;
  // consider dropping, as this overlaps the `B2BUnitNode.id`
  uid: string;
}

export enum TREE_TOGGLE {
  EXPANDED,
  COLLAPSED
}

export interface EntitiesModel<T> {
  values: T[];
}

// Selfcare Billing Account

export interface TmaAccountBalance {
  balanceType: string;
  amount: TmaTmfMoney;
  validFor: TimePeriod;
}

export interface TmaAccountRelationship {
  relationshipType: string;
  account: TmaBillingAccountRef;
}

export interface TmaFormat {
  id: string;
  href?: string;
  name?: string;
  description?: string;
  isRef?: boolean;
}

export interface TmaCellSpecification {
  id: string;
  href: string;
  billingDateShift: number;
  billingPeriod: string;
  chargeDateOffset: number;
  creditDateOffset: number;
  dateShift: number;
  description: string;
  frequency: boolean;
  isRef: boolean;
  mailingDateOffset: string;
  name: string;
  paymentDueDateOffset: number;
  validFor: TimePeriod;
}

export interface TmaBillStructure {
  cycleSpecification: TmaCellSpecification;
  format: TmaFormat;
  presentationMedia: TmaFormat[];
}

export interface TmaContact {
  contactName: string;
  contactType: string;
  partyRoleType: string;
  contactMedium: ContactMedium[];
  relatedParty: TmaTmfRelatedParty;
  validFor: TimePeriod;
}

export interface TmaPaymentPlan {
  numberOfPayments: number;
  paymentFrequency: string;
  planType: string;
  priority: number;
  status: string;
  paymentMethod: TmaBillingAccountRef;
  totalAmount: TmaTmfMoney;
  validFor: TimePeriod;
}

export interface TmaTaxExamption {
  certificateNumber: string;
  issuingJurisdiction: string;
  reason: string;
  validFor: TimePeriod;
}

export interface TmaBillingAccounts {
  id: string;
  href: string;
  accountType: string;
  description: string;
  name: string;
  paymentStatus: string;
  ratingType: string;
  accountBalance: TmaAccountBalance[];
  accountRelationship: TmaAccountRelationship[];
  billStructure: TmaBillStructure;
  contact: TmaContact[];
  creditLimit: TmaTmfMoney;
  defaultPaymentMethod: TmaBillingAccountRef;
  financialAccount: TmaBillingAccountRef;
  paymentPlan: TmaPaymentPlan[];
  relatedProperty: TmaTmfRelatedParty[];
  taxExamption: TmaTaxExamption[];
}

// Billing Agreements

export enum TmaBaAgreementType {
  APPROVED = 'approved'
}

export interface TmaAgreementAuthorization {
  date: Date;
  signatureRepresentation: string;
  state: string;
  SCHEMA_LOCATION: string;
  '@type': string;
}

export interface TmaTermOrCondition {
  id: string;
  description: string;
  validFor: ValidFor;
  SCHEMA_LOCATION: string;
  '@type': string;
}

export interface TmaAgreementItem {
  product: SpiProductOffering[];
  productOffering: SpiProductOffering[];
  termOrCondition: TmaTermOrCondition[];
  SCHEMA_LOCATION: string;
  '@type': string;
}

export interface TmaAgreementSpecification {
  id: string;
  href: string;
  description: string;
  name: string;
  SCHEMA_LOCATION: string;
  '@referredType': string;
}

export interface TmaAgreementValue {
  default: boolean;
  unitOfMeasure: string;
  valueFrom: string;
  valueTo: string;
  valueType: string;
  validFor: ValidFor;
  value: string;
  SCHEMA_LOCATION: string;
  '@type': string;
}

export interface TmaAgreementCharacteristicValue {
  value: TmaAgreementValue;
  SCHEMA_LOCATION: string;
  '@type': string;
}

export interface TmaBillingAgreements {
  id: string;
  href: string;
  agreementType: string;
  description: string;
  documentNumber: number;
  initialDate: Date;
  name: string;
  statementOfIntent: string;
  status: string;
  version: string;
  agreementAuthorization: TmaAgreementAuthorization[];
  agreementItem: TmaAgreementItem[];
  agreementPeriod: ValidFor;
  agreementSpecification: TmaAgreementSpecification;
  characteristic: TmaAgreementCharacteristicValue[];
  completionDate: ValidFor;
  engagedParty: SpiBillingAccount[];
  SCHEMA_LOCATION: string;
  '@type': string;
}

export enum TmaBillStateEnum {
  NEW = 'new',
  ON_HOLD = 'onHold',
  VALIDATED = 'validated',
  SENT = 'sent',
  SETTLED = 'settled',
  PARTIALY_PAID = 'partiallyPaid'
}

export interface TmaAppliedPayment {
  appliedAmount: Amount;
  payment: TmaPaymentRef;
}

export interface TmaTaxItem {
  taxCategory: string;
  taxRate: number;
  taxAmount: Amount;
}

export interface TmaCustomerBills {
  id: string;
  href: string;
  billDate: Date;
  category: string;
  state: TmaBillStateEnum;
  billNo: string;
  lastUpdate: Date;
  nextBillDate: Date;
  paymentDueDate: Date;
  runType: string;
  amountDue: Amount;
  appliedPayment: TmaAppliedPayment[];
  billDocument: AttachmentRef[];
  billingAccount: SpiBillingAccount;
  billingPeriod: TimePeriod;
  financialAccount: SpiBillingAccount;
  relatedParty: TmaTmfRelatedParty[];
  remainingAmount: Amount;
  taxExcludedAmount: Amount;
  taxIncludedAmount: Amount;
  taxItem: TmaTaxItem[];
}
