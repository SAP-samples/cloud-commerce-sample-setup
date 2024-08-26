// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { AsmModule } from '@spartacus/asm';
import { AsmOccModule } from '@spartacus/asm/occ';
import {
  AnonymousConsentsModule,
  CostCenterModule,
  CostCenterOccModule,
  ExternalRoutesModule,
  ProductModule,
  ProductOccModule,
  UserModule,
  UserOccModule
} from '@spartacus/core';
import { AdministrationRootModule } from '@spartacus/organization/administration/root';
import { OrderApprovalRootModule } from '@spartacus/organization/order-approval/root';
import {
  AnonymousConsentManagementBannerModule,
  AnonymousConsentsDialogModule,
  BannerCarouselModule,
  BannerModule,
  BreadcrumbModule,
  CategoryNavigationModule,
  CmsParagraphModule,
  ConsentManagementModule,
  FooterNavigationModule,
  HamburgerMenuModule,
  HomePageEventModule,
  JsonLdBuilderModule,
  LinkModule,
  LoginRouteModule,
  LogoutModule,
  MyCouponsModule,
  MyInterestsModule,
  NavigationEventModule,
  NavigationModule,
  NotificationPreferenceModule,
  PageTitleModule,
  PaymentMethodsModule,
  ProductCarouselModule,
  ProductDetailsPageModule,
  ProductFacetNavigationModule,
  ProductImagesModule,
  ProductIntroModule,
  ProductListingPageModule,
  ProductListModule,
  ProductPageEventModule,
  ProductReferencesModule,
  ProductSummaryModule,
  ProductTabsModule,
  SearchBoxModule,
  SiteContextSelectorModule,
  StockNotificationModule,
  TabParagraphContainerModule
} from '@spartacus/storefront';
import {
  AppointmentModule,
  AvailabilityCheckModule,
  DeliveryModeConfigModule,
  GeographicAddressModule,
  JourneyChecklistConfigModule,
  PremiseLookupModule,
  ProductOfferingModule,
  ProductOfferingQualificationModule,
  QueryServiceQualificationModule,
  RecommendationModule,
  ReservationModule,
  SearchTimeSlotModule,
  TmaAuthModule,
  TmaBillingFrequencyConfigModule,
  TmaCartModule,
  TmaChecklistActionModule,
  TmaConsumptionConfigModule,
  TmaOccCartModule,
  TmaOccProductModule,
  TmaPremiseDetailModule,
  TmaProductModule,
  TmaProductSpecificationAverageCostModule,
  TmaProductSpecificationForViewDetailsConfigModule,
  TmaTmfCartModule,
  TmfModule
} from '../../../core';
import { TmaCheckoutModule } from '../../../core/checkout';
import { TmaGlobalMessageModule } from '../../../core/global-message/tma-global-message.module';
import { SubscriptionModule } from '../../../core/subscription/subscription.module';
import { TmfAppointmentModule } from '../../../core/tmf-appointment';
import { TmfResourcePoolManagementModule } from '../../../core/tmf-resource-pool-management/tmf-resource-pool-management.module';
import { TmfQueryServiceQualificationModule } from '../../../core/tmf-service-qualification-management';
import { TmaCmsLibModule, TmaRoutingModule } from '../../../storefrontlib';
import { TmaAsmFeatureModule } from '../features/tma-asm-feature.module';
import { TmaUserFeatureModule } from '../features/tma-user-feature.module';
import { WishListModule } from '@spartacus/cart/wish-list';
import { CartBaseOccModule } from '@spartacus/cart/base/occ';
import { CheckoutOccModule } from '@spartacus/checkout/base/occ';
import { CartPageEventModule } from '@spartacus/cart/base/core';
import { TmaCartBaseFeatureModule } from '../features/tma-cart-base-feature.module';
import { TmaCheckoutB2bFeatureModule } from '../features/tma-checkout-b2b-feature.module';
import { TmaOrderFeatureModule } from '../features/tma-order-feature.module';
import { TmaCheckoutFeatureModule } from '../features/tma-checkout-feature.module';
import { TmaBuildAddToCartModule } from '../../../core/add-to-cart/tma-build-add-to-cart.module';

@NgModule({
  imports: [
    AsmModule,
    // Auth Core
    TmaAuthModule.forRoot(),
    TmaRoutingModule.forRoot(),
    LogoutModule, // will be come part of auth package
    LoginRouteModule, // will be come part of auth package

    // Basic Cms Components
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    PageTitleModule,
    BreadcrumbModule,
    TmaCmsLibModule,

    // User Core
    UserModule,
    UserOccModule,
    // User UI
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,

    // Anonymous Consents Core
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,

    // b2b
    CostCenterModule.forRoot(),
    AdministrationRootModule,
    OrderApprovalRootModule,

    // Product Core
    ProductModule.forRoot(),
    ProductOccModule,

    // Product UI
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,

    // Cart Modules
    WishListModule,

    // OccModule
    AsmOccModule,
    CartBaseOccModule,
    CheckoutOccModule,
    TmaOccCartModule,
    TmaOccProductModule,
    CostCenterOccModule,

    // Page Events
    NavigationEventModule,
    HomePageEventModule,
    CartPageEventModule,
    ProductPageEventModule,

    /************************* Opt-in features *************************/

    ExternalRoutesModule.forRoot(), // to opt-in explicitly, is added by default schematics
    JsonLdBuilderModule,

    // Tma Modules
    TmfModule.forRoot(),
    PremiseLookupModule.forRoot(),
    TmfResourcePoolManagementModule.forRoot(),
    TmfAppointmentModule.forRoot(),
    TmfQueryServiceQualificationModule.forRoot(),
    TmaBillingFrequencyConfigModule.forRoot(),
    TmaProductSpecificationAverageCostModule.forRoot(),
    TmaProductSpecificationForViewDetailsConfigModule.forRoot(),
    TmaPremiseDetailModule.forRoot(),
    TmaTmfCartModule.forRoot(),
    SubscriptionModule,
    TmaBuildAddToCartModule.forRoot(),
    TmaChecklistActionModule.forRoot(),
    AppointmentModule.forRoot(),
    SearchTimeSlotModule.forRoot(),
    JourneyChecklistConfigModule.forRoot(),
    GeographicAddressModule.forRoot(),
    ReservationModule.forRoot(),
    AvailabilityCheckModule.forRoot(),
    RecommendationModule.forRoot(),
    TmaGlobalMessageModule.forRoot(),
    TmaConsumptionConfigModule.forRoot(),
    TmaCartModule.forRoot(),
    TmaCheckoutModule.forRoot(),
    DeliveryModeConfigModule.forRoot(),
    QueryServiceQualificationModule.forRoot(),
    ProductOfferingModule.forRoot(),
    TmaProductModule.forRoot(),
    ProductOfferingQualificationModule.forRoot(),

    /************************* lazy loading features *************************/
    TmaUserFeatureModule,
    TmaCartBaseFeatureModule,
    TmaCheckoutFeatureModule,
    TmaCheckoutB2bFeatureModule,
    TmaOrderFeatureModule,
    TmaAsmFeatureModule,
  ],
})
export class TmaSpartacusB2bFeaturesModule {}
