// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { BaseStore, Language, Product } from '@spartacus/core';
import { AttachmentRef, ContactMedium } from '../../model/appointment.model';
import { TimePeriod } from '../../model/time-period.model';
import { TmfAppointmentApiModel } from '../../tmf-appointment/tmf-appointment-models';
import { TmfRelatedParty } from '../../tmf-resource-pool-management';
import { LOCAL_STORAGE } from '../../util/constants';
import TmfTimePeriod = TmfAppointmentApiModel.TmfTimePeriod;

const { SCHEMA_LOCATION, REFERRED_TYPE } = LOCAL_STORAGE.AT_TYPES;

export namespace Tmf {

  export interface TmfNote {
    author?: string;
    date?: Date;
    text?: string;
  }

  export enum TmfPriorityType {
    _0 = '0',
    _1 = '1',
    _2 = '2',
    _3 = '3',
    _4 = '4'
  }

  export interface TmfChannel {
    '@type'?: string;
    href?: string;
    id?: string;
    name?: string;
    role?: string;
  }

  export interface TmfMoney {
    unit?: string;
    value?: string;
  }

  export enum TmfStateType {
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

  export interface TmfExternalIdentifier {
    externalIdentifierType?: string;
    id?: string;
    owner?: string;
  }

  export interface TmfAttachment {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    description?: string;
    href?: string;
    id?: string;
    mimeType?: string;
    '@type'?: string;
    url?: string;
    validFor?: TmfTimePeriod;
    type?: string;
  }


  export interface TmfProductOfferingRef {
    REFERRED_TYPE?: string;
    '@type'?: string;
    href?: string;
    id: string;
    attachment?: TmfAttachment;
    name?: string;
    variantOption?: TmfVariantOption[];
  }

  export interface TmfShoppingCartRef {
    href?: string;
    id?: string;
  }

  export interface TmfPaginatedProductOrder {
    orders?: TmfProductOrder[];
    totalCount?: number;
  }

  export interface TmfAppointmentRef {
    href?: string;
    id?: string;
    REFERRED_TYPE?: string;
  }

  export interface TmfProductOrderStateType {
    acknowledged?: 'Acknowledged';
    rejected?: 'Rejected';
    pending?: 'Pending';
    held?: 'Held';
    inProgress?: 'InProgress';
    cancelled?: 'Cancelled';
    completed?: 'Completed';
    failed?: 'Failed';
    partial?: 'Partial';
    assessingCancellation?: 'AssessingCancellation';
    pendingCancellation?: 'PendingCancellation';
  }

  export interface TmfPriceAlteration {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    applicationDuration?: number;
    cycle?: TmfCycle;
    description?: string;
    name?: string;
    price?: TmfPrice;
    priceType?: string;
    priority?: TmfPriorityType;
    productOfferingPrice?: TmfProductOfferingPriceRef;
    recurringChargePeriod?: TmfRecurringChargePeriod;
    unitOfMeasure?: string;
  }

  export enum TmfRecurringChargePeriod {
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
    PAY_NOW = 'paynow',
    ON_FIRST_BILL = 'onfirstbill',
    ON_CANCELATION = 'oncancellation'
  }

  export interface TmfCycle {
    cycleStart?: number;
    cycleEnd?: number;
  }

  export interface TmfBillingAccountRef {
    REFERRED_TYPE?: string;
    href?: string;
    id?: string;
    name?: string;
  }

  export interface TmfDeliveryModeRef {
    REFERRED_TYPE?: string;
    '@type'?: string;
    href?: string;
    id?: string;
    name?: string;
    description?: string;
    price?: TmfMoney
  }

  export interface TmfPrice {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    dutyFreeAmount?: TmfMoney;
    percentage?: number;
    taxIncludedAmount?: TmfMoney;
    taxRate?: number;
  }

  export interface TmfPaymentRef {
    code?: string;
    href?: string;
    id?: string;
    name?: string;
    type?: TmfPaymentType;
    REFERRED_TYPE?: string;
    paymentMethod?: TmfPaymentRef
  }

  export interface TmfPaymentDetails {
    id?: string;
    href?: string;
    name?: string;
    description?: string;
    preferred?: false;
    status?: string;
    '@type'?: string;
    type?: string;
    details?: TmfCreditCardDetails;
    relatedParty?: TmaTmfRelatedParty;
    account: TmfCreditCardAccountDetails[]
  }

  export interface TmfCreditCardAccountDetails {
    name: string
  }

  export interface TmfPaymentDetails {
    id?: string;
    href?: string;
    name?: string;
    preferred?: false;
    status?: string;
    '@type'?: string;
    details?: TmfCreditCardDetails;
    relatedParty?: TmaTmfRelatedParty;
    account: TmfCreditCardAccountDetails[]
  }

  export interface TmfCreditCardDetails {
    brand: string;
    expirationDate: string;
    lastFourDigits: string;
    nameOnCard: string;
  }

  export interface TmfCreditCardAccountDetails {
    name: string
  }

  export enum TmfPaymentType {
    VOUCHER = 'VOUCHER',
    CREDITCARD = 'CREDITCARD',
    DIRECTDEBIT = 'DIRECTDEBIT'
  }

  export interface TmfPlace {
    REFERRED_TYPE?: string;
    SCHEMA_LOCATION?: string;
    href?: string;
    id?: string;
    name?: string;
    role?: string;
  }

  export interface TmfPromotionRef {
    REFERRED_TYPE?: string;
    '@type'?: string;
    href?: string;
    id?: string;
    message?: string;
    status?: string;
  }

  export interface TmfOrderPrice {
    id?: string;
    name?: string;
    description?: string;
    unitOfMeasure?: string;
    recurringChargePeriod?: string;
    usageChargeType?: string;
    priceType?: TmfPriceType;
    price?: TmfPrice;
    priceAlteration?: TmfPriceAlteration[];
    billingAccount?: TmfBillingAccountRef;
    orderPrice?: TmfOrderPrice[];
    productOfferingPrice?: TmfProductOfferingPriceRef;
    '@type'?: string;
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
  }

  export enum TmfPriceType {
    DISCOUNT = 'DISCOUNT',
    DELIVERY_COST = 'DELIVERY_COST',
  }

  export interface TmfOrderItem {
    id?: string;
    action?: string;
    appointment?: TmfAppointmentRef;
    billingAccount?: TmfBillingAccountRef;
    contractStartDate?: Date;
    itemPrice?: TmfOrderPrice[];
    itemTerm?: TmfOrderTerm[];
    itemTotalPrice?: TmfOrderPrice[];
    orderItem?: TmfOrderItem[];
    orderItemRelationship?: TmfOrderItemRelationship[];
    payment?: TmfPaymentRef[];
    processType?: TmfProcessType;
    product?: TmaTmfProduct;
    productOffering?: TmfProductOfferingRef;
    promotion?: TmfPromotionRef[];
    qualification?: TmfQualificationRef[];
    quantity?: number;
    state?: TmfStateType;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
  }

  export interface TmfOrderItemRelationship {
    id?: string;
    '@type'?: string;
  }

  export interface TmfProductCharacteristic {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    name?: string;
    value?: string;
  }

  export interface TmfProductPrice {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    billingAccount?: TmfBillingAccountRef;
    description?: string;
    id?: string;
    name?: string;
    price?: TmfPrice;
    priceType?: string;
    prodPriceAlteration?: TmfPriceAlteration;
    recurringChargePeriod?: string;
    unitOfMeasure?: string;
  }

  export interface TmfProductRelationship {
    type?: string;
    relationshiType?: string;
    product?: TmfProductRef;
  }

  export interface TmfProductRef {
    id?: string;
    href?: string;
  }

  export interface TmfProductSpecification {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    brand?: string;
    bundledProductSpecification?: TmfBundledProductSpecification[];
    description?: string;
    href?: string;
    id?: string;
    isBundle?: boolean;
    lastUpdate?: Date;
    lifecycleStatus?: string;
    name?: string;
    productNumber?: string;
    productSpecCharacteristic?: TmfProductSpecCharacteristic[];
    productSpecType?: TmfProductSpecType[];
    serviceSpecification?: TmfServiceSpecificationRef[];
    usageSpecification?: TmfUsageSpecificationRef;
    validFor?: TmfTimePeriod;
    version?: string;
  }

  export interface TmfBundledProductSpecification {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    href?: string;
    id?: string;
    lifecycleStatus?: string;
    name?: string;
  }

  export interface TmfProductSpecCharacteristic {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    '@valueSchemaLocation'?: string;
    configurable?: boolean;
    description?: string;
    extensible?: boolean;
    isUnique?: boolean;
    maxCardinality?: number;
    minCardinality?: number;
    name?: string;
    productSpecCharRelationship?: TmfProductSpecCharRelationship[];
    productSpecCharacteristicValue?: TmfProductSpecCharacteristicValue[];
    regex?: string;
    validFor?: TmfTimePeriod;
    valueType?: string;
  }

  export interface TmfProductSpecCharRelationship {
    '@type'?: string;
    type?: string;
    charSpecSeq?: number;
    href?: string;
    id?: string;
    name?: string;
    validFor?: TmfTimePeriod;
  }

  export interface TmfProductSpecCharacteristicValue {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    isDefault?: boolean;
    rangeInterval?: string;
    regex?: string;
    unitOfMeasure?: string;
    validFor?: TmfTimePeriod;
    value?: string;
    valueFrom?: string;
    valueTo?: string;
    valueType?: string;
  }

  export interface TmfProductSpecType {
    description?: string;
    id?: string;
  }

  export interface TmfServiceSpecificationRef {
    '@baseType'?: string;
    REFERRED_TYPE?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    externalIdentifier?: TmfExternalIdentifier[];
    href?: string;
    id?: string;
    name?: string;
    targetServiceSchema?: TmfTargetServiceSchema;
    version?: string;
  }

  export interface TmfTargetServiceSchema {
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
  }

  export interface TmfUsageSpecificationRef {
    REFERRED_TYPE?: string;
    externalIdentifier?: TmfExternalIdentifier[];
    href?: string;
    id?: string;
    name?: string;
  }

  export interface TmfProductTerm {
    '@type'?: string;
    description?: string;
    duration?: TmfQuantity;
    name?: string;
    validFor?: TmfTimePeriod;
  }

  export interface TmfQuantity {
    amount?: number;
    units?: string;
  }

  export interface TmfOrderTerm {
    '@type'?: string;
    description?: string;
    duration?: TmfQuantity;
    name?: string;
  }

  export interface TmfRealizingResource {
    REFERRED_TYPE?: string;
    href?: string;
    id?: string;
    name?: string;
    role?: string;
  }

  export interface TmfVariantOption {
    id?: string;
    variantCategory?: string;
    variantValue?: string;
  }

  export interface TmfQualificationRef {
    REFERRED_TYPE?: string;
    href?: string;
    id?: string;
    qualificationItemId?: string;
  }

  export interface TmfProductOrderRef {
    REFERRED_TYPE?: string;
    href?: string;
    id?: string;
    orderItemAction?: string;
    orderItemId?: string;
  }

  export interface TmfRealizingService {
    REFERRED_TYPE?: string;
    href?: string;
    id?: string;
    name?: string;
    role?: string;
  }

  export interface TmaChecklistAction {
    id: string;
    name: string;
    actionType: string;
    productOffering?: TmfProductOfferingRef[];
  }

  export interface BaseSites {
    baseSites?: BaseSite[];
  }

  export interface BaseSite {
    channel?: string;
    defaultLanguage?: Language;
    defaultPreviewCatalogId?: string;
    defaultPreviewCategoryCode?: string;
    defaultPreviewProductCode?: string;
    locale?: string;
    name?: string;
    theme?: string;
    uid?: string;
    stores?: BaseStore[];
    urlPatterns?: string[];
    urlEncodingAttributes?: string[];
  }

  export interface TmfSubscriptionBase {
    id: string;
    subscriberIdentity: string;
    subscriptionAccess: TmfSubscriptionAccess[];
  }

  export interface TmfSubscriptionBaseDetail {
    subscriptionBase: TmfSubscriptionBaseRef;
    user: TmaTmfRelatedParty;
  }

  export interface TmfSubscriptionAccess {
    accessType?: TmfAccessType;
    subscriptionBase?: TmfSubscriptionBaseRef;
    relatedParty?: TmaTmfRelatedParty;
  }

  export interface TmfAccessType {
    value?: string;
  }

  export interface TmfSubscriptionBaseRef {
    product?: TmfProductRef[];
    relatedPartyRef?: TmaTmfRelatedParty[];
    id?: string;
    accessType?: string;
  }

  export interface TmfProductRef {
    id?: string;
    name?: string;
    href?: string;
    publicIdentifier?: string;
    user?: TmaTmfRelatedParty;
  }

  export interface TmfProduct {
    id: string;
    name: string;
    productRelationship?: TmfProductRelationship[];
    startDate?: Date;
    status?: TmfProductStatus;
    terminationDate?: Date;
    relatedParty?: TmaTmfRelatedParty[];
    productOrder?: TmfProductOrder[];
    productOffering?: TmfProductOfferingRef;
  }

  export interface TmaTmfProduct {
    id?: string;
    name?: string;
    productRelationship?: TmfProductRelationship[];
    startDate?: Date;
    status?: TmfProductStatus;
    terminationDate?: Date;
    relatedParty?: TmaTmfRelatedParty[];
    productOrder?: TmfProductOrderRef[];
    productOffering?: TmfProductOfferingRef;
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    billingAccount?: TmfBillingAccountRef[];
    characteristic?: TmfProductCharacteristic[];
    description?: string;
    href?: string;
    isBundle?: boolean;
    isCustomerVisible?: boolean;
    place?: TmfPlace[];
    productPrice?: TmfProductPrice[];
    productSerialNumber?: string;
    productSpecification?: TmfProductSpecification;
    productTerm?: TmfProductTerm[];
    realizingResource?: TmfRealizingResource[];
    realizingService?: TmfRealizingService[];
  }

  export enum TmfProductStatus {
    CREATED = 'CREATED',
    PENDINGACTIVE = 'PENDINGACTIVE',
    CANCELLED = 'CANCELLED',
    ACTIVE = 'ACTIVE',
    PENDINGTERMINATE = 'PENDINGTERMINATE',
    TERMINATED = 'TERMINATED',
    SUSPENDED = 'SUSPENDED',
    ABORTED = 'ABORTED'
  }

  export enum TmfProductRelatedPartyRole {
    OWNER = 'OWNER',
    ADMINISTRATOR = 'ADMINISTRATOR',
    BENEFICIARY = 'BENEFICIARY'
  }

  export interface TmfProductRelationship {
    id: string;
    name: string;
    href: string;
    publicIdentifier?: string;
    user: TmaTmfRelatedParty;
  }

  export interface TmaTimePeriod {
    startDateTime: Date;
    endDateTime: Date;
  }

  export interface TmfProductOrder {
    id?: string;
    orderItemId?: string;
    '@baseType'?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    baseSiteId?: string;
    category?: string;
    completionDate?: Date;
    description?: string;
    expectedCompletionDate?: Date;
    externalId?: string;
    href?: string;
    priority?: TmfPriorityType;
    orderDate?: Date;
    notificationContact?: string;
    requestedCompletionDate?: Date;
    requestedStartDate?: Date;
    state?: string;
    billingAccount?: TmfBillingAccountRef;
    channel?: TmfChannel[];
    deliveryMode?: TmfDeliveryModeRef;
    note?: TmfNote[];
    orderCost?: TmfOrderPrice[];
    orderItem?: TmfOrderItem[];
    orderTotalPrice?: TmfOrderPrice[];
    payment?: TmfPaymentRef[];
    place?: TmfPlace[];
    promotion?: TmfPromotionRef[];
    relatedParty?: TmfRelatedParty[];
    shoppingCart?: TmfShoppingCartRef;
  }

  export interface TmfProductOrderDetails extends TmfProductOrder {
    productOrderItem?: TmfOrderItem[]
  }

  export interface TmfUsageConsumptionReport {
    bucket: TmfBucketRef[];
  }

  export interface TmfBucketRef {
    bucketBalance?: TmfBucketBalanceRef[];
    bucketCounter?: TmfBucketCounterRef[];
    id?: string;
    name?: string;
    usageType?: string;
    product?: Product;
  }

  export interface TmfBucketBalanceRef {
    remainingValue?: number;
    remainingValueLabel?: string;
    unit?: string;
    validFor?: TmaTimePeriod;
  }

  export interface TmfBucketCounterRef {
    value?: number;
    valueLabel?: string;
    unit?: string;
    validFor?: TmaTimePeriod;
  }

  export interface TmfProductOfferingRef {
    id: string;
    href?: string;
    name?: string;
  }

  export interface TmaTmfShoppingCart {
    id: string;
    href: string;
    baseSiteId: string;
    cartItem?: TmaTmfCartItem[];
    relatedParty?: TmaTmfRelatedParty[];
    cartCosts?: TmfCartPrice[];
    promotion?: TmfPromotionRef[];
  }

  export interface TmaTmfCartItem {
    id: string;
    action?: TmaTmfActionType;
    quantity?: number;
    cartItem?: TmaTmfCartItem[];
    validation?: TmaTmfValidationMessage[];
    processType?: TmfProcessType;
    productOffering?: TmfProductOfferingRef;
    product?: TmaTmfProduct;
    itemPrice?: TmfCartPrice[];
    contractStartDate?: string;
    appointment?: TmfAppointmentRef;
    promotion?: TmfPromotionRef[];
    itemTerm?: TmfCartTerm[];
  }

  export interface TmfCartTerm {
    id?: string;
    '@type'?: string;
    description?: string;
    duration?: TmfQuantity;
    name?: string;
  }

  export interface TmfCartPrice {
    id?: string;
    name?: string;
    description?: string;
    priceType?: string;
    recurringChargePeriod?: string;
    chargeType?: string;
    unitOfMeasure?: string;
    dutyFreeAmount?: TmfPrice;
    taxIncludedAmount?: TmfPrice;
    taxRate?: number;
    cartPrice?: TmfCartPrice[];
    cycle?: TmfCycle;
    tierStart?: string;
    tierEnd?: string;
    usageChargeType?: string;
    parentId?: string;
    priceAlteration?: TmfCartPrice[];
    percentage?: string;
    price?: TmfCartPrice;
    productOfferingPrice?: TmfProductOfferingPriceRef;
  }

  export interface TmaTmfValidationMessage {
    code?: string;
    message?: string;
  }

  export enum TmaTmfActionType {
    ADD = 'ADD',
    UPDATE = 'UPDATE'
  }

  export interface TmaTmfRelatedParty {
    id: string;
    href?: string;
    role?: string;
    name?: string;
  }

  export interface TmfRecommendation {
    id?: string;
    name?: string;
    href?: string;
    item?: TmfRecommendationItem[];
  }

  export interface TmfRecommendationItem {
    offering?: TmfProductOfferingRef;
    price?: TmfProductOfferingPrice;
  }

  export interface TmfPrice {
    value?: string;
    unit?: string;
  }

  export interface TmfProductOfferingPrice {
    id?: string;
    name?: string;
    itemType?: string;
    isBundle?: boolean;
    bundledPop?: TmfProductOfferingPrice[];
    isPriceOverride?: boolean;
    priceType?: string;
    priceEvent?: string;
    percentage?: string;
    price?: TmfPrice;
  }

  export interface TmfGeographicAddress {
    id?: string;
    href?: string;
    streetNr?: string;
    streetNrLast?: string;
    streetNrLastSuffix?: string;
    streetName?: string;
    streetType?: string;
    streetSuffix?: string;
    postcode?: string;
    locality?: string;
    city?: string;
    stateOfProvince?: string;
    country?: string;
    relatedParty: TmaTmfRelatedParty;
    geographicSubAddress?: TmfGeographicSubAddress;
    isInstallationAddress?: boolean;
    isUnloadingAddress?: boolean;
    isContactAddress?: boolean;
    isShippingAddress?: boolean;
    isBillingAddress?: boolean;
  }

  export interface TmfGeographicSubAddress {
    id?: string;
    href?: string;
    name?: string;
    type?: string;
    subUnitType?: string;
    subUnitNumber?: string;
    levelType?: string;
    levelNumber?: string;
    buildingName?: string;
    privateStreetNumber?: string;
    privateStreetName?: string;
  }

  export interface TmfProductOffering {
    id: string;
    href: string;
    name: string;
    description: string;
    isBundle: boolean;
    isSellable: boolean;
    productOfferingPrice?: TmfProductOfferingPrice[];
    children?: TmfProductOffering[];
    priceContext?: TmfPriceContext[];
  }

  export interface TmfPriceContext {
    id: string;
    poRelationship: TmfProductRelationship;
    isPriceOverride: string;
    productOfferingPrice: TmfProductOfferingPriceRef;
    isBundle: boolean;
    isSellable: boolean;
    productOfferingTerm: TmfProductOfferingTerm[];
    processType: TmfProcessType;
    priority: number;
    relatedParty: TmfRelatedParty;
  }

  export interface TmfProductOfferingPriceRef {
    id: string;
    href: string;
    name: string;
    '@baseType'?: string;
    REFERRED_TYPE?: string;
    SCHEMA_LOCATION?: string;
    '@type'?: string;
  }

  export interface TmfProductOfferingTerm {
    id: string;
    description: string;
    name: string;
    duration: string;
    validFor: string;
  }

  export interface TmfProcessType {
    id: TmfProcessTypeEnum;
  }

  export interface TmfAgreeement {
    id: string;
    href?: string;
    agreementId?: string;
    name?: string;
  }

  export interface TmfBillingAccount {
    id?: string;
    href?: string;
    name?: string;
  }

  export interface TmfProductCharacteristic {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    name?: string;
    value?: string;
  }

  export interface TmfSpiProductOffering {
    id?: string;
    href?: string;
    name?: string;
  }

  export interface TmfProductOrderItem {
    orderItemAction: string;
    orderItemId: string;
    productOrderHref: string;
    productOrderId: string;
    role: string;
  }

  export interface TmfSpiPrice {
    taxRate?: string;
    dutyFreeAmount?: TmfPrice;
    taxIncludedAmount?: TmfPrice;
  }

  export interface TmfProductPrice {
    SCHEMA_LOCATION?: string;
    '@type'?: string;
    billingAccount?: TmfBillingAccountRef;
    description?: string;
    id?: string;
    name?: string;
    price?: TmfPrice;
    priceType?: string;
    prodPriceAlteration?: TmfPriceAlteration;
    recurringChargePeriod?: string;
    unitOfMeasure?: string;
  }

  export interface TmfProductRelationship {
    relationshipType: string;
    product?: TmfProductRef;
  }

  export interface TmfProductSpecification {
    id?: string;
    href?: string;
    name?: string;
    version?: string;
  }

  export interface TmfSubscriptions {
    id: string;
    href: string;
    description: string;
    isBundle: boolean;
    isCustomerVisible: Boolean;
    name: string;
    orderDate: Date;
    productSerialNumber: string;
    startDate: Date;
    terminationDate: Date;
    agreement?: TmfAgreeement[];
    billingAccount: TmfBillingAccount;
    product?: TmfProductRef[];
    productCharacteristic?: TmfProductCharacteristic[];
    productOffering: TmfSpiProductOffering;
    productOrderItem: TmfProductOrderItem[];
    productPrice: TmfProductPrice;
    productRelationship: TmfProductRelationship;
    productSpecification?: TmfProductSpecification;
    productTerm: TmfProductOfferingTerm[];
    relatedParty: TmaTmfRelatedParty[];
    status: boolean;
  }

  export interface TmfSubscribedProductsInventory {
    subscribedProducts: TmfSubscriptions[];
    childrens: TmfSubscriptions[];
  }

  export enum TmfProcessTypeEnum {
    ACQUISITION = 'ACQUISITION',
    DEVICE_ONLY = 'DEVICE_ONLY',
    RETENTION = 'RETENTION',
    SWITCH_SERVICE_PROVIDER = 'SWITCH_SERVICE_PROVIDER',
    TARIFF_CHANGE = 'TARIFF_CHANGE',
    RENEWAL = 'RENEWAL'
  }

  // Selfcare Billing Accounts
  export interface TmfAccountBalance {
    balanceType: string;
    amount: TmfPrice;
    validFor: TimePeriod;
  }

  export interface TmfAccountRelationship {
    relationshipType: string;
    account: TmfBillingAccount;
  }

  export interface TmfFormat {
    id: string;
    href: string;
    name: string;
    description: string;
    isRef: boolean;
  }

  export interface TmfCellSpecification {
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

  export interface TmfBillStructure {
    cycleSpecification: TmfCellSpecification;
    format: TmfFormat;
    presentationMedia: TmfFormat[];
  }

  export interface TmfContact {
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
    paymentMethod: TmfBillingAccount;
    totalAmount: TmfPrice;
    validFor: TimePeriod;
  }

  export interface TmfTaxExamption {
    certificateNumber: string;
    issuingJurisdiction: string;
    reason: string;
    validFor: TimePeriod;
  }

  export interface TmfBillingAccounts {
    id: string;
    href: string;
    accountType: string;
    description: string;
    name: string;
    paymentStatus: string;
    ratingType: string;
    accountBalance: TmfAccountBalance[];
    accountRelationship: TmfAccountRelationship[];
    billStructure: TmfBillStructure;
    contact: TmfContact[];
    creditLimit: TmfPrice;
    defaultPaymentMethod: TmfBillingAccount;
    financialAccount: TmfBillingAccount;
    paymentPlan: TmaPaymentPlan[];
    relatedProperty: TmaTmfRelatedParty[];
    taxExamption: TmfTaxExamption[];
  }

  // Selfcare Billing Agreements

  export interface TmfAgreementAuthorization{
    date: Date;
    signatureRepresentation: string;
    state: string;
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfTermOrCondition{
    id: string;
    description: string;
    validFor: TimePeriod;
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfAgreementItem{
    product: TmfSpiProductOffering[];
    productOffering: TmfSpiProductOffering[];
    termOrCondition: TmfTermOrCondition[];
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfAgreementSpecification{
    id: string;
    href: string;
    description: string;
    name: string;
    SCHEMA_LOCATION: string;
    REFERRED_TYPE: string;
  }

  export interface TmfAgreementValue{
    default: boolean;
    unitOfMeasure: string;
    valueFrom: string;
    valueTo: string;
    valueType: string;
    validFor: TimePeriod;
    value: string;
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfAgreementCharacteristicValue{
    value: TmfAgreementValue;
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfBillingAgreements{
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
    agreementAuthorization: TmfAgreementAuthorization[];
    agreementItem: TmfAgreementItem[];
    agreementPeriod: TimePeriod;
    agreementSpecification: TmfAgreementSpecification;
    characteristic: TmfAgreementCharacteristicValue[];
    completionDate: TimePeriod;
    engagedParty: TmfBillingAccount[];
    SCHEMA_LOCATION: string;
    '@type': string;
  }

  export interface TmfEligibilityUnavailabilityReason {
    code: string;
    label: string;
  }

  export interface TmfProductOfferingQualificationItem {
    id: string;
    action: string;
    product?: TmfProduct;
    eligibilityUnavailabilityReason?: TmfEligibilityUnavailabilityReason[];
    productOffering: TmfProduct;
  }

  export interface TmfProductOfferingQualification {
    id?: string;
    href?: string;
    productOfferingQualificationItem: TmfProductOfferingQualificationItem[];
  }


  //Customer Bills
  export enum TmfBillStateEnum {
    NEW = 'new',
    ON_HOLD = 'onHold',
    VALIDATED = 'validated',
    SENT = 'sent',
    SETTLED = 'settled',
    PARTIALY_PAID = 'partiallyPaid'
  }

  export interface TmfAppliedPayment {
    appliedAmount: TmfPrice;
    payment: TmfPaymentRef;
  }

  export interface TmfTaxItem {
    taxCategory: string;
    taxRate: number;
    taxAmount: TmfPrice;
  }

  export interface TmfCustomerBills {
    id: string;
    href: string;
    billDate: Date;
    category: string;
    state: TmfBillStateEnum;
    billNo: string;
    lastUpdate: Date;
    nextBillDate: Date;
    paymentDueDate: Date;
    runType: string;
    amountDue: TmfPrice;
    appliedPayment: TmfAppliedPayment[];
    billDocument: AttachmentRef[];
    billingAccount: TmfBillingAccount;
    billingPeriod: TmaTimePeriod;
    financialAccount: TmfBillingAccount;
    relatedParty: TmfRelatedParty[];
    remainingAmount: TmfPrice;
    taxExcludedAmount: TmfPrice;
    taxIncludedAmount: TmfPrice;
    taxItem: TmfTaxItem[];
  }
  export interface TmfEligibilityUnavailabilityReason {
    code: string;
    label: string;
  }

  export interface TmfProductOfferingQualificationItem {
    id: string;
    action: string;
    product?: TmfProduct;
    eligibilityUnavailabilityReason?: TmfEligibilityUnavailabilityReason[];
    productOffering: TmfProduct;
  }

  export interface TmfProductOfferingQualification {
    id?: string;
    href?: string;
    productOfferingQualificationItem: TmfProductOfferingQualificationItem[];
  }

}
