// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { RoutesConfig, RoutingConfig } from '@spartacus/core';

const namePlaceholder = `name`;
const idPlaceholder = `id`;
const balanceTypePlaceholder = `balanceType`;

const subscriptionsPath = `selfcare/subscriptions/:` + namePlaceholder;
const childProductsPath = subscriptionsPath + `/childProducts`;
const agreementPath = subscriptionsPath + `/agreement`;
const accountPath = subscriptionsPath + `/account`;
const orderPath = subscriptionsPath + `/order`;
const addressPath = subscriptionsPath + `/address`;
const billingAccountDetailsPath = `selfcare/billing-accounts/:` + idPlaceholder;
const accountBalancePath = billingAccountDetailsPath + `/accountBalance`;
const balanceDetailsPath = billingAccountDetailsPath + `/accountBalance/:` + balanceTypePlaceholder;
const billStructurePath = billingAccountDetailsPath + `/billStructure`;
const billStructureDetailsPath = billingAccountDetailsPath + `/billStructure/billDetails`;
const billingContactPath = billingAccountDetailsPath + `/contact`;
const billingCreditPath = `selfcare/billing-accounts/:` + namePlaceholder + `/credit`;
const billingPlanPath = `selfcare/billing-accounts/:` + namePlaceholder + `/payment`;
const billingRelatedPartyPath = `selfcare/billing-accounts/:` + namePlaceholder + `/relatedParty`;
const billingAgreementDetailsPath = `selfcare/billing-agreements/:` + idPlaceholder;
const billingAgreementItem = billingAgreementDetailsPath + `/agreementItem`;
const billingAgreementSpecification = billingAgreementDetailsPath + `/agreementSpecification`;
const billingEngagedParty = billingAgreementDetailsPath + `/engagedParty`;
const billingAgreementSpecificationDetails = billingAgreementDetailsPath + `/agreementSpecification/details`;
const contactDetailsPath = billingAccountDetailsPath + `/contact/:` + `contactMedium`;
const creditLimitPath = billingAccountDetailsPath + `/creditLimit`;
const customerBillsDetailsPath = `selfcare/customer-bills/:` + `billNo`;
const customerBillsDetailsRelatedPartyPath = customerBillsDetailsPath + `/relatedParty`;
const customerBillsDetailsAccountPath = customerBillsDetailsPath + `/account`;
const customerBillsDetailsBillDocumentsPath = customerBillsDetailsPath + `/billDocument`;
const customerBillsDetailsBillDocumentDetailsPath = customerBillsDetailsPath + `/billDocument/:` + `id`;
const paymentPlanPath = billingAccountDetailsPath + `/paymentPlan`;
const paymentPlanDetailsPath = billingAccountDetailsPath + `/paymentPlan/:` + `paymentId`;
const relatedPartyPath = billingAccountDetailsPath + `/relatedParty`;


export const TmaSelfcareRoutesConfig: RoutesConfig = {
  selfcareSubscriptionsDetail: {
    paths: [`${subscriptionsPath}`],
    paramsMapping: {}
  },
  SubscriptionsChildProducts: {
    paths: [`${childProductsPath}`],
    paramsMapping: {}
  },
  SubscriptionsAgreement: {
    paths: [`${agreementPath}`],
    paramsMapping: {}
  },
  SubscriptionsAccount: {
    paths: [`${accountPath}`],
    paramsMapping: {}
  },
  SubscriptionsOrder: {
    paths: [`${orderPath}`],
    paramsMapping: {}
  },
  SubscriptionsAddress: {
    paths: [`${addressPath}`],
    paramsMapping: {}
  },
  selfcareBillingAccountsDetail: {
    paths: [`${billingAccountDetailsPath}`],
    paramsMapping: {}
  },
  AccountBalance: {
    paths: [`${accountBalancePath}`],
    paramsMapping: {}
  },
  BalanceDetails: {
    paths: [`${balanceDetailsPath}`],
    paramsMapping: {}
  },
  BillStructure: {
    paths: [`${billStructurePath}`],
    paramsMapping: {}
  },
  BillStructureDetails: {
    paths: [`${billStructureDetailsPath}`],
    paramsMapping: {}
  },
  BillingContact: {
    paths: [`${billingContactPath}`],
    paramsMapping: {}
  },
  ContactDetails: {
    paths: [`${contactDetailsPath}`],
    paramsMapping: {}
  },
  CreditLimit: {
    paths: [`${creditLimitPath}`],
    paramsMapping: {}
  },
  PaymentPlan: {
    paths: [`${paymentPlanPath}`],
    paramsMapping: {}
  },
  PaymentPlanDetails: {
    paths: [`${paymentPlanDetailsPath}`],
    paramsMapping: {}
  },
  RelatedParty: {
    paths: [`${relatedPartyPath}`],
    paramsMapping: {}
  },
  selfcareBillingAgreementsDetail: {
    paths: [`${billingAgreementDetailsPath}`],
    paramsMapping: {}
  },
  AgreementItem: {
    paths: [`${billingAgreementItem}`],
    paramsMapping: {}
  },
  AgreementSpecification: {
    paths: [`${billingAgreementSpecification}`],
    paramsMapping: {}
  },
  AgreementEngagedParty: {
    paths: [`${billingEngagedParty}`],
    paramsMapping: {}
  },
  AgreementSpecificationDetails: {
    paths: [`${billingAgreementSpecificationDetails}`],
    paramsMapping: {}
  },
  selfcareCustomerBillsDetail: {
    paths: [`${customerBillsDetailsPath}`],
    paramsMapping: {}
  },
  CustomerBillsRelatedParty: {
    paths: [`${customerBillsDetailsRelatedPartyPath}`],
    paramsMapping: {}
  },
  CustomerBillsAccount: {
    paths: [`${customerBillsDetailsAccountPath}`],
    paramsMapping: {}
  },
  CustomerBillsBillDocuments: {
    paths: [`${customerBillsDetailsBillDocumentsPath}`],
    paramsMapping: {}
  },
  CustomerBillsBillDocumentDetails: {
    paths: [`${customerBillsDetailsBillDocumentDetailsPath}`],
    paramsMapping: {}
  }
};

export const defaultTmaSelfcareRoutingConfig: RoutingConfig = {
  routing: {
    routes: TmaSelfcareRoutesConfig
  }
};
