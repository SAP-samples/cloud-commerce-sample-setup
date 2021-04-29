import { NgModule } from '@angular/core';
import { AnonymousConsentsModule, AuthModule, CartModule, CartOccModule, CheckoutModule, CheckoutOccModule, CostCenterOccModule, ProductModule, ProductOccModule, UserOccTransitionalModule, UserTransitionalModule } from "@spartacus/core";
import { AddressBookModule, AnonymousConsentManagementBannerModule, AnonymousConsentsDialogModule, BannerCarouselModule, BannerModule, BreadcrumbModule, CartComponentModule, CartPageEventModule, CategoryNavigationModule, CheckoutComponentModule, CheckoutLoginModule, CmsParagraphModule, ConsentManagementModule, FooterNavigationModule, HamburgerMenuModule, HomePageEventModule, LinkModule, LoginRouteModule, LogoutModule, MyCouponsModule, MyInterestsModule, NavigationEventModule, NavigationModule, NotificationPreferenceModule, OrderCancellationModule, OrderConfirmationModule, OrderDetailsModule, OrderHistoryModule, OrderReturnModule, PaymentMethodsModule, ProductCarouselModule, ProductDetailsPageModule, ProductFacetNavigationModule, ProductImagesModule, ProductIntroModule, ProductListingPageModule, ProductListModule, ProductPageEventModule, ProductReferencesModule, ProductSummaryModule, ProductTabsModule, ReplenishmentOrderConfirmationModule, ReplenishmentOrderDetailsModule, ReplenishmentOrderHistoryModule, ReturnRequestDetailModule, ReturnRequestListModule, SearchBoxModule, SiteContextSelectorModule, StockNotificationModule, TabParagraphContainerModule, WishListModule } from "@spartacus/storefront";
import { UserFeatureModule } from './features/user/user-feature.module';
import { TagManagementFeatureModule } from './features/tracking/tag-management-feature.module';
import { PersonalizationFeatureModule } from './features/tracking/personalization-feature.module';
import { StoreFinderFeatureModule } from './features/storefinder/store-finder-feature.module';
import { SmartEditFeatureModule } from './features/smartedit/smart-edit-feature.module';
import { QualtricsFeatureModule } from './features/qualtrics/qualtrics-feature.module';
import { ProductConfiguratorFeatureModule } from './features/product-configurator/product-configurator-feature.module';
import { ProductBulkPricingFeatureModule } from './features/product/product-bulk-pricing-feature.module';
import { ProductVariantsFeatureModule } from './features/product/product-variants-feature.module';
import { OrganizationAdministrationFeatureModule } from './features/organization/organization-administration-feature.module';
import { OrganizationOrderApprovalFeatureModule } from './features/organization/organization-order-approval-feature.module';
import { CartSavedCartFeatureModule } from './features/cart/cart-saved-cart-feature.module';
import { AsmFeatureModule } from './features/asm/asm-feature.module';

@NgModule({
  declarations: [],
  imports: [
    // Auth Core
    AuthModule.forRoot(),
    LogoutModule, // will become part of auth package
    LoginRouteModule, // will become part of auth package

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
    BreadcrumbModule,

    // User Core
    UserTransitionalModule,
    UserOccTransitionalModule,
    // User UI
    AddressBookModule,
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

    // Cart Core
    CartModule.forRoot(),
    CartOccModule,
    // Cart UI
    CartComponentModule,
    WishListModule,

    // Checkout Core
    CheckoutModule.forRoot(),
    CheckoutOccModule,
    CostCenterOccModule,
    // Checkout UI
    CheckoutLoginModule,
    CheckoutComponentModule,
    OrderConfirmationModule,

    // Order
    OrderHistoryModule,
    OrderDetailsModule,
    OrderCancellationModule,
    OrderReturnModule,
    ReturnRequestListModule,
    ReturnRequestDetailModule,
    ReplenishmentOrderHistoryModule,
    ReplenishmentOrderDetailsModule,
    ReplenishmentOrderConfirmationModule,

    // Page Events
    NavigationEventModule,
    HomePageEventModule,
    CartPageEventModule,
    ProductPageEventModule,
    UserFeatureModule,
    TagManagementFeatureModule,
    PersonalizationFeatureModule,
    StoreFinderFeatureModule,
    SmartEditFeatureModule,
    QualtricsFeatureModule,
    ProductConfiguratorFeatureModule,
    ProductBulkPricingFeatureModule,
    ProductVariantsFeatureModule,
    OrganizationAdministrationFeatureModule,
    OrganizationOrderApprovalFeatureModule,
    CartSavedCartFeatureModule,
    AsmFeatureModule,

  ]
})
export class SpartacusFeaturesModule { }
