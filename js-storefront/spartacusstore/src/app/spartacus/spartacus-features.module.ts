import { NgModule } from '@angular/core';
import { AnonymousConsentsModule, AuthModule, CartModule, CartOccModule, CheckoutModule, CheckoutOccModule, CostCenterOccModule, ExternalRoutesModule, ProductModule, ProductOccModule, UserOccTransitionalModule, UserTransitionalModule } from "@spartacus/core";
import { AddressBookModule, AnonymousConsentManagementBannerModule, AnonymousConsentsDialogModule, BannerCarouselModule, BannerModule, BreadcrumbModule, CartComponentModule, CartPageEventModule, CategoryNavigationModule, CheckoutComponentModule, CheckoutLoginModule, CmsParagraphModule, ConsentManagementModule, FooterNavigationModule, HamburgerMenuModule, HomePageEventModule, LinkModule, LoginRouteModule, LogoutModule, MyCouponsModule, MyInterestsModule, NavigationEventModule, NavigationModule, NotificationPreferenceModule, OrderCancellationModule, OrderConfirmationModule, OrderDetailsModule, OrderHistoryModule, OrderReturnModule, PaymentMethodsModule, ProductCarouselModule, ProductDetailsPageModule, ProductFacetNavigationModule, ProductImagesModule, ProductIntroModule, ProductListingPageModule, ProductListModule, ProductPageEventModule, ProductReferencesModule, ProductSummaryModule, ProductTabsModule, ReplenishmentOrderConfirmationModule, ReplenishmentOrderDetailsModule, ReplenishmentOrderHistoryModule, ReturnRequestDetailModule, ReturnRequestListModule, SearchBoxModule, SiteContextSelectorModule, StockNotificationModule, TabParagraphContainerModule, WishListModule } from "@spartacus/storefront";
import { SmartEditFeatureModule } from './features/smartedit/smart-edit-feature.module';
import { UserFeatureModule } from './features/user/user-feature.module';
import { PersonalizationFeatureModule } from './features/tracking/personalization-feature.module';
import { StoreFinderFeatureModule } from './features/storefinder/store-finder-feature.module';
import { ProductBulkPricingFeatureModule } from './features/product/product-bulk-pricing-feature.module';
import { ProductVariantsFeatureModule } from './features/product/product-variants-feature.module';
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
    SmartEditFeatureModule,
    // External routes,
    ExternalRoutesModule.forRoot(),
    PersonalizationFeatureModule,
    StoreFinderFeatureModule,
    ProductBulkPricingFeatureModule,
    ProductVariantsFeatureModule,
    CartSavedCartFeatureModule,
    AsmFeatureModule,
  ]
})
export class SpartacusFeaturesModule { }
