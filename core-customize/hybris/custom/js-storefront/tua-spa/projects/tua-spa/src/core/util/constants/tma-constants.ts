// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProcessTypeEnum } from '../../model/tma-common.model';
import { TmaConstantResourceModel } from './tma-constant-resource.model';

export const LOCAL_STORAGE: TmaConstantResourceModel = {
  BASE_SITES: {
    utilities: 'utilitiesspa'
  },
  SEARCH: {
    QUERY: 'query:',
    FREE_TEXT: 'freeTextSearch:',
    PRODUCT_OFFERING_GROUP: 'productOfferingGroups:',
    PARENT_BPO: 'parentBundledPo:',
    PRODUCT_SPECIFICATION: 'productSpecification:',
    CODE: 'code:',
    PROCESS_TYPE: 'process_string_mv:',
    ALL_CATEGORIES: 'allCategories:',
    RELEVANCE: 'relevance:'
  },
  GUIDED_SELLING: {
    CURRENT_SELECTION: {
      DASH: '-'
    },
    DEFAULT_PROCESS_TYPE: TmaProcessTypeEnum.ACQUISITION
  },
  MSISDN_RESERVATION: {
    MSISDN_TYPE: 'Resource',
    CHECKLIST_ACTION_TYPE_MSISDN: 'MSISDN',
    RESOURCE_ITEM_RESERVATION: 'resourceItemReservation'
  },
  AT_TYPES: {
    SCHEMA_LOCATION: '@schemaLocation',
    REFERRED_TYPE: '@referredType',
    APPLICATION_JSON: 'application/json'
  },
  TEST_VALUES: {
    TEST_VALUE: 'test-value'
  },
  HTTP_LINKS: {
    LOCALHOST: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
    B2CTELCOTMFWEBSERVICES: '/b2ctelcotmfwebservices'
  },
  APPOINTMENT: {
    REQUESTED_NUMBER_OF_TIMESLOTS: 5,
    END_DATE_OF_TIMESLOTS: 3,
    CHECKLIST_ACTION_TYPE_APPOINTMENT: 'APPOINTMENT',
    INTERVENTION_ADDRESS: 'interventionAddress',
    APPOINTMENT_TYPE: 'Appointment'
  },
  USAGE_TYPE: {
    EACH_RESPECTIVE_TIER: 'each_respective_tier',
    HIGHEST_APPLICABLE_TIER: 'highest_applicable_tier'
  },
  DECIMAL: {
    RANGE: 2,
    PERCENTAGE_DIVISOR: 100
  },
  CART_ACTION_TYPE: {
    REMOVE_ACTION_TYPE: 'REMOVE'
  },
  INSTALLATION_ADDRESS: {
    CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS: 'INSTALLATION_ADDRESS',
    QUERY_SERVICE_QUALIFICATION: 'QueryServiceQualification',
    SEARCH_CRITERIA: 'SearchCriteria',
    INSTALLATION_PLACE: 'Installation Place',
    GEOGRAPHIC_ADDRESS: 'GeographicAddress'
  },
  PAGES: {
    CART_PAGE: 'cartPage',
    CHECKOUT_REVIEW_PAGE: 'CheckoutReviewOrder',
    PRODUCT_PAGE: 'product',
    SWITCH_PROVIDER: 'switch-provider'
  },
  ORDER_PROCESSING: {
    ORDER_PROCESSING_ERROR: 'OrderProcessingError'
  },
  ILLEGAL_ARGUMENT : {
    ILLEGAL_ARGUMENT_ERROR: 'IllegalArgumentError'
  },
  COMMERCE_CART_MODIFICATION : {
    COMMERCE_CART_MODIFICATION_ERROR: 'CommerceCartModificationError'
  },
  ENDPOINT: {
    SLASH: '/',
    QUESTION_MARK: '?'
  },
  COMMON: {
    SLASH: '/',
    QUESTION_MARK: '?'
  },
  SELFCARE: {
    SUBSCRIPTIONS: {
      KEY: 'name',
      CELLS: ['name', 'status', 'id'],
      DOMAIN_TYPE: 'selfcare.subscriptions',
      CELL_DOMAIN_TYPE: 'selfcareSubscriptions',
      ROUTE: 'selfcareSubscriptionsDetail',
      CHILD_PRODUCTS_DOMAIN_TYPE:
        'selfcare.subscriptions.details.childProducts',
      ACCOUNT_DOMAIN_TYPE: 'selfcare.subscriptions.details.account',
      AGREEMENT_DOMAIN_TYPE: 'selfcare.subscriptions.details.agreement',
      ORDER_DOMAIN_TYPE: 'selfcare.subscriptions.details.order',
      ADDRESS_DOMAIN_TYPE: 'selfcare.subscriptions.details.address'
    },
    BILLING_ACCOUNTS: {
      KEY: 'id',
      PAYMENT_ID: 'paymentId',
      BALANCE_TYPE: 'balanceType',
      CONTACT_MEDIUM: 'contactMedium',
      CELLS: ['name', 'accountType', 'paymentStatus', 'id'],
      DOMAIN_TYPE: 'selfcare.billingAccounts',
      CELL_DOMAIN_TYPE: 'selfcareBillingAccounts',
      ROUTE: 'selfcareBillingAccountsDetail',
      ACCOUNT_BALANCE_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.accountBalance',
      ACCOUNT_BALANCE_DETAILS_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.accountBalance.details',
      BILL_STRUCTURE_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.billStructure',
      BILL_STRUCTURE_DETAILS_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.billStructure.details',
      CONTACT_DOMAIN_TYPE: 'selfcare.billingAccounts.details.contact',
      CONTACT_DETAILS_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.contact.details',
      CREDIT_LIMIT_DOMAIN_TYPE: 'selfcare.billingAccounts.details.creditLimit',
      PAYMENT_PLAN_DOMAIN_TYPE: 'selfcare.billingAccounts.details.paymentPlan',
      PAYMENT_PLAN_DETAILS_DOMAIN_TYPE:
        'selfcare.billingAccounts.details.paymentPlan.details',
      RELATED_PARTY_DOMAIN_TYPE: 'selfcare.billingAccounts.details.relatedParty'
    },
    BILLING_AGREEMENTS: {
      KEY: 'id',
      CELLS: ['name', 'agreementType', 'status', 'id'],
      DOMAIN_TYPE: 'selfcare.billingAgreements',
      CELL_DOMAIN_TYPE: 'selfcareBillingAgreements',
      ROUTE: 'selfcareBillingAgreementsDetail',
      AGREEMENT_ITEM_DOMAIN_TYPE: 'selfcare.billingAgreements.details.agreementItem',
      AGREEMENT_SPECIFICATION_DOMAIN_TYPE: 'selfcare.billingAgreements.details.agreementSpecification',
      ENGAGED_PARTY_DOMAIN_TYPE: 'selfcare.billingAgreements.details.engagedParty',
      AGREEMENT_SPECIFICATION_DETAILS_DOMAIN_TYPE: 'selfcare.billingAgreements.details.agreementSpecificationDetails'
    },
    CUSTOMER_BILLS: {
      KEY: 'billNo',
      CELLS: ['billNo', 'category', 'state','id'],
      DOMAIN_TYPE: 'selfcare.customerBills',
      CELL_DOMAIN_TYPE: 'selfcareCustomerBills',
      ROUTE: 'selfcareCustomerBillsDetail',
      BILL_DOCUMENT_DOMAIN_TYPE: 'selfcare.customerBills.details.billDocument',
      BILL_DOCUMENT_DETAILS_DOMAIN_TYPE: 'selfcare.customerBills.details.billDocument.details',
      ACCOUNT_DOMAIN_TYPE: 'selfcare.customerBills.details.account',
      RELATED_PARTY_DOMAIN_TYPE: 'selfcare.customerBills.details.relatedParty',
      BILL_DOCUMENT_ID: 'id'
    }
  },
  ADDRESS: {
    REGION: 'region.isocodeShort',
    SUGGESTED_ADDRESSES: 'SUGGESTED_ADDRESSES',
    INVALID_ADDRESS: 'addressForm.invalidAddress',
    ADDRESS_SELECTED: 'paymentForm.billingAddressSelected',
    NAME: 'John Doe',
    ACCEPT: 'ACCEPT',
    REJECT: 'REJECT',
    REVIEW: 'REVIEW'
  },
  SUBSCRIBED_PRODUCT: {
    CHARACTERISTIC: {
      TECHNICAL_ID: 'Technical Id',
      AVERAGE_CONSUMPTION_ESTIMATION: 'Average Consumption Estimation'
    }
  },
  PLACE: {
    BILLING_ADDRESS: 'BILLING_ADDRESS',
    DELIVERY_ADDRESS: 'DELIVERY_ADDRESS'
  },
  PRICE_TYPE: {
    ORDER_PRICE: 'orderPrice',
    CART_PRICE: 'cartPrice'
  },
  PAYMENT_METHOD_TYPE: {
    DIRECT_DEBIT: 'directDebit'
  },
  PAYMENT_METHOD: {
    PAYMENT_SELECTED: 'paymentMethods.paymentMethodSelected'
  },
  SUBSCRIPTION_TERM: {
    MONTHLY_24: 'monthly_24'
  },
  REASON_FOR_PURCHASE: {
    MOVE: 'move',
    SWITCH_PROVIDER: 'switchProvider'
  },
  DEPENDENT_PRODUCT: {
    ONLY_DEPENDENT_PRODUCT_IS_SET: 'onlyDependentIsSet',
    DEPENDENT_PRODUCT_AND_INSTALLATION_ADDRESS_ARE_SET: 'bothAreSet',
    NOTHING_IS_SET: 'nothingIsSet'
  },
  DEPENDENT_BUNDLE: {
    TV_UNLIMITED: 'homeDealBundle'
  },
  CART_ITEM: {
    QUANTITY: 'quantity'
  },
  CHECKLIST_ACTION : {
    TEXT: "CHECKLIST ACTION"
  },
  TMA_FEATURE_FLAGS: {
    DIRECT_DEBIT_FEATURE: 'directDebitFeature',
    PURCHASE_WITH_ASSURANCE_FEATURE: 'purchaseWithAssuranceFeature'
  },
  TYPE: {
    VALUE: '@type'
  }
};
