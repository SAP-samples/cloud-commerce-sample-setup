// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import {
  GenericLinkModule,
  MediaModule,
  OutletModule,
  SplitViewModule,
  TableHeaderCellComponent,
  TableModule
} from '@spartacus/storefront';
import { LOCAL_STORAGE } from '../../../../core/util/constants';
import { TmaCardModule } from '../../shared/tma-card/tma-card.module';
import { TmaActiveLinkCellComponent } from '../../shared/tma-table/tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from '../../shared/tma-table/tma-cell.component';
import { TmaCellModule } from '../../shared/tma-table/tma-cell.module';
import { TmaPaymentStatusCellComponent } from '../../shared/tma-table/tma-status/tma-payment-status-cell.component';
import { TmaStatusCellComponent } from '../../shared/tma-table/tma-status/tma-status-cell.component';
import { TmaToggleLinkCellComponent } from '../../shared/tma-table/tma-toggle-link/tma-toggle-link-cell.component';
import { SelfcareBannerComponent } from './banner/selfcare-banner.component';
import { AccountBalanceDetailsComponent } from './billing-accounts/account-balance-details/account-balance-details.component';
import { AccountBalanceComponent } from './billing-accounts/account-balance/account-balance.component';
import { BillStructureDetailsComponent } from './billing-accounts/bill-structure-details/bill-structure-details.component';
import { BillStructureComponent } from './billing-accounts/bill-structure/bill-structure.component';
import { BillingAccountDetailsComponent } from './billing-accounts/billing-account-details/billing-account-details.component';
import { ContactDetailsComponent } from './billing-accounts/contact-details/contact-details.component';
import { ContactComponent } from './billing-accounts/contact/contact.component';
import { CreditLimitComponent } from './billing-accounts/credit-limit/credit-limit.component';
import { CustomerBillDetailsComponent } from './customer-bills/customer-bill-details/customer-bill-details';
import { PaymentPlanDetailsComponent } from './billing-accounts/payment-plan-details/payment-plan-details.component';
import { PaymentPlanComponent } from './billing-accounts/payment-plan/payment-plan.component';
import { RelatedPartyComponent } from './billing-accounts/related-party/related-party.component';
import { SelfcareBillingAccountsComponent } from './billing-accounts/selfcare-billing-accounts.component';
import { AgreementItemComponent } from './billing-agreements/agreementItem/agreement-item.component';
import { AgreementSpecificationComponent } from './billing-agreements/agreementSpecification/agreement-specification.component';
import { BillingAgreementDetailsComponent } from './billing-agreements/billing-agreement-details/billing-agreement-details';
import { EngagedPartyComponent } from './billing-agreements/engagedParty/engaged-party.component';
import { SelfcareBillingAgreementsComponent } from './billing-agreements/selfcare-billing-agreements.component';
import { SpecificationDetailsComponent } from './billing-agreements/specificationDetails/specification-details.component';
import { SelfcareCustomerBillsComponent } from './customer-bills/selfcare-customer-bills.component';
import { AccountComponent } from './subscriptions/account/account.component';
import { CustomerBillAccountComponent } from './customer-bills/account/account.component';
import { CustomerBillRelatedPartyComponent } from './customer-bills/related-party/related-party.component';
import { BillDocumentComponent } from './customer-bills/bill-documents/bill-documents.component';
import {
  BillDocumentDetailsComponent
} from './customer-bills/bill-documents/bill-document-details/bill-document-details.component';
import { AddressComponent } from './subscriptions/address/address.component';
import { AgreementComponent } from './subscriptions/agreement/agreement.component';
import { ChildProductsComponent } from './subscriptions/child-products/child-products.component';
import { OrderComponent } from './subscriptions/order/order.component';
import { SelfcareSubscriptionsComponent } from './subscriptions/selfcare-subscriptions.component';
import { SubscriptionDetailsComponent } from './subscriptions/subscription-details/subscription-details.component';

@NgModule({
  imports: [
    CommonModule,
    TmaCardModule,
    TmaCellModule,
    GenericLinkModule,
    I18nModule,
    MediaModule,
    TableModule,
    OutletModule,
    UrlModule,
    RouterModule,
    SplitViewModule,
    ConfigModule.withConfig({
      cmsComponents: {
        BannerComponent: {
          component: SelfcareBannerComponent
        },
        SelfcareSubscriptionsComponent: {
          component: SelfcareSubscriptionsComponent,
          childRoutes: {
            children: [
              {
                path: `:${'name'}`,
                component: SubscriptionDetailsComponent,
                children: [
                  {
                    path: 'account',
                    component: AccountComponent
                  },
                  {
                    path: 'agreement',
                    component: AgreementComponent
                  },
                  {
                    path: 'order',
                    component: OrderComponent
                  },
                  {
                    path: 'childProducts',
                    component: ChildProductsComponent
                  },
                  {
                    path: 'address',
                    component: AddressComponent
                  }
                ]
              }
            ]
          }
        },
        BillingAccountsComponent: {
          guards: [AuthGuard],
          component: SelfcareBillingAccountsComponent,
          childRoutes: {
            children: [
              {
                path: `:${'id'}`,
                component: BillingAccountDetailsComponent,
                children: [
                  {
                    path: 'accountBalance',
                    component: AccountBalanceComponent,
                    children: [
                      {
                        path: `:${LOCAL_STORAGE.SELFCARE.BILLING_ACCOUNTS.BALANCE_TYPE}`,
                        component: AccountBalanceDetailsComponent
                      }
                    ]
                  },
                  {
                    path: 'billStructure',
                    component: BillStructureComponent,
                    children: [
                      {
                        path: 'billDetails',
                        component: BillStructureDetailsComponent
                      }
                    ]
                  },
                  {
                    path: 'contact',
                    component: ContactComponent,
                    children: [
                      {
                        path: `:${LOCAL_STORAGE.SELFCARE.BILLING_ACCOUNTS.CONTACT_MEDIUM}`,
                        component: ContactDetailsComponent
                      }
                    ]
                  },
                  {
                    path: 'creditLimit',
                    component: CreditLimitComponent
                  },
                  {
                    path: 'paymentPlan',
                    component: PaymentPlanComponent,
                    children: [
                      {
                        path: `:${LOCAL_STORAGE.SELFCARE.BILLING_ACCOUNTS.PAYMENT_ID}`,
                        component: PaymentPlanDetailsComponent
                      }
                    ]
                  },
                  {
                    path: 'relatedParty',
                    component: RelatedPartyComponent
                  }
                ]
              }
            ]
          }
        },
        BillingAgreementsComponent: {
          guards: [AuthGuard],
          component: SelfcareBillingAgreementsComponent,
          childRoutes: {
            children: [
              {
                path: `:${'id'}`,
                component: BillingAgreementDetailsComponent,
                children: [
                  {
                    path: 'agreementItem',
                    component: AgreementItemComponent,
                  },
                  {
                    path: 'engagedParty',
                    component: EngagedPartyComponent,
                  },
                  {
                    path: 'agreementSpecification',
                    component: AgreementSpecificationComponent,
                    children: [
                      {
                        path: 'details',
                        component: SpecificationDetailsComponent
                      }
                    ]
                  }
                ]
              }
            ]
          }
        },
        CustomerBillsComponent: {
          guards: [AuthGuard],
          component: SelfcareCustomerBillsComponent,
          childRoutes: {
            children: [
              {
                path: `:${'billNo'}`,
                component: CustomerBillDetailsComponent,
                children: [
                  {
                    path: 'account',
                    component: CustomerBillAccountComponent
                  },
                  {
                    path: 'relatedParty',
                    component: CustomerBillRelatedPartyComponent
                  },
                  {
                    path: 'billDocument',
                    component: BillDocumentComponent,
                    children: [
                      {
                        path: `:${'id'}`,
                        component: BillDocumentDetailsComponent
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    })
  ],
  exports: [
    AccountComponent,
    AgreementComponent,
    AgreementItemComponent,
    AgreementSpecificationComponent,
    AccountBalanceComponent,
    AccountBalanceDetailsComponent,
    BillingAccountDetailsComponent,
    BillingAgreementDetailsComponent,
    BillStructureComponent,
    BillStructureDetailsComponent,
    ContactComponent,
    ContactDetailsComponent,
    ChildProductsComponent,
    EngagedPartyComponent,
    CreditLimitComponent,
    CustomerBillDetailsComponent,
    PaymentPlanComponent,
    OrderComponent,
    AddressComponent,
    PaymentPlanDetailsComponent,
    RelatedPartyComponent,
    SelfcareBannerComponent,
    SelfcareBillingAccountsComponent,
    SelfcareCustomerBillsComponent,
    SelfcareBillingAgreementsComponent,
    SelfcareSubscriptionsComponent,
    SpecificationDetailsComponent,
    SubscriptionDetailsComponent,
    CustomerBillAccountComponent,
    CustomerBillRelatedPartyComponent,
    BillDocumentComponent,
    BillDocumentDetailsComponent
  ],
  declarations: [
    AccountComponent,
    AgreementComponent,
    AgreementItemComponent,
    AgreementSpecificationComponent,
    AccountBalanceComponent,
    AccountBalanceDetailsComponent,
    BillingAccountDetailsComponent,
    BillingAgreementDetailsComponent,
    BillStructureComponent,
    BillStructureDetailsComponent,
    ContactComponent,
    ContactDetailsComponent,
    ChildProductsComponent,
    EngagedPartyComponent,
    CreditLimitComponent,
    CustomerBillDetailsComponent,
    OrderComponent,
    AddressComponent,
    PaymentPlanComponent,
    PaymentPlanDetailsComponent,
    RelatedPartyComponent,
    SelfcareBannerComponent,
    SelfcareBillingAccountsComponent,
    SelfcareBillingAgreementsComponent,
    SelfcareCustomerBillsComponent,
    SelfcareSubscriptionsComponent,
    SpecificationDetailsComponent,
    SubscriptionDetailsComponent,
    CustomerBillAccountComponent,
    CustomerBillRelatedPartyComponent,
    BillDocumentComponent,
    BillDocumentDetailsComponent
  ]
})
export class SelfcareModule {}
