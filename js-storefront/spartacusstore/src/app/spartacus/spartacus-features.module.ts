import { NgModule } from '@angular/core';
import { AnonymousConsentsModule, AuthModule, CartModule, CartOccModule, CostCenterOccModule, ExternalRoutesModule, OrderOccModule, ProductModule, ProductOccModule, UserOccTransitional_4_2_Module, UserTransitional_4_2_Module } from "@spartacus/core";
import { AddressBookModule, AnonymousConsentManagementBannerModule, AnonymousConsentsDialogModule, BannerCarouselModule, BannerModule, BreadcrumbModule, CartComponentModule, CartPageEventModule, CategoryNavigationModule, CmsParagraphModule, ConsentManagementModule, FooterNavigationModule, HamburgerMenuModule, HomePageEventModule, LinkModule, LoginRouteModule, LogoutModule, MyCouponsModule, MyInterestsModule, NavigationEventModule, NavigationModule, NotificationPreferenceModule, PaymentMethodsModule, ProductCarouselModule, ProductDetailsPageModule, ProductFacetNavigationModule, ProductImagesModule, ProductIntroModule, ProductListingPageModule, ProductListModule, ProductPageEventModule, ProductReferencesModule, ProductSummaryModule, ProductTabsModule, SearchBoxModule, SiteContextSelectorModule, StockNotificationModule, TabParagraphContainerModule, WishListModule } from "@spartacus/storefront";
import { UserFeatureModule } from './features/user/user-feature.module';
import { PersonalizationFeatureModule } from './features/tracking/personalization-feature.module';
import { StoreFinderFeatureModule } from './features/storefinder/store-finder-feature.module';
import { SmartEditFeatureModule } from './features/smartedit/smart-edit-feature.module';
import { ProductVariantsFeatureModule } from './features/product/product-variants-feature.module';
import { ProductImageZoomFeatureModule } from './features/product/product-image-zoom-feature.module';
import { CartSavedCartFeatureModule } from './features/cart/cart-saved-cart-feature.module';
import { CartQuickOrderFeatureModule } from './features/cart/cart-quick-order-feature.module';
import { CartImportExportFeatureModule } from './features/cart/cart-import-export-feature.module';
import { OrderFeatureModule } from './features/order/order-feature.module';
import { CheckoutFeatureModule } from './features/checkout/checkout-feature.module';
import { AsmFeatureModule } from './features/asm/asm-feature.module';
import { TagManagementFeatureModule } from './features/tracking/tag-management-feature.module';
import { ProductConfiguratorFeatureModule } from './features/product-configurator/product-configurator-feature.module';

@NgModule({
  declarations: [],
  imports: [
    // Auth Core
    AuthModule.forRoot(),
    LogoutModule,
    LoginRouteModule,
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
    // User Core,
    UserTransitional_4_2_Module,
    UserOccTransitional_4_2_Module,
    // User UI,
    AddressBookModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,
    // Anonymous Consents Core,
    AnonymousConsentsModule.forRoot(),
    // Anonymous Consents UI,
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,
    // Product Core,
    ProductModule.forRoot(),
    ProductOccModule,
    // Product UI,
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
    // Cart Core,
    CartModule.forRoot(),
    CartOccModule,
    // Cart UI,
    CartComponentModule,
    WishListModule,
    CostCenterOccModule,
    // Order,
    OrderOccModule,
    // Page Events,
    NavigationEventModule,
    HomePageEventModule,
    CartPageEventModule,
    ProductPageEventModule,
    // External routes,
    ExternalRoutesModule.forRoot(),
    UserFeatureModule,
    PersonalizationFeatureModule,
    StoreFinderFeatureModule,
    SmartEditFeatureModule,
    ProductVariantsFeatureModule,
    ProductImageZoomFeatureModule,
    CartSavedCartFeatureModule,
    CartQuickOrderFeatureModule,
    CartImportExportFeatureModule,
    OrderFeatureModule,
    CheckoutFeatureModule,
    AsmFeatureModule,
    TagManagementFeatureModule,
    ProductConfiguratorFeatureModule,
  ]
})
export class SpartacusFeaturesModule { }
