// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { TmaAddressFormModule } from './address-form';
import { TmaCartComponentModule } from './cart';
import { TmaCheckoutComponentModule } from './checkout';
import { TmaConsumptionModule } from './consumption';
import { TmaGuidedSellingModule } from './guided-selling';
import { JourneyChecklistComponentModule } from './journey-checklist';
import { SelfcareModule, SubscriptionComponentModule } from './myaccount';
import {
  TmaCommodityProductDetailsModule,
  TmaProductListCarouselModule,
  TmaProductListModule,
  TmaProductSummaryModule
} from './product';
import { TmaProductTabsModule } from './product/product-tabs';
import { ServiceabilityBannerModule } from './serviceability';
import { ServiceabilityButtonModule } from './serviceability-button';
import { TmaOrderApprovalModule } from './order-approval';
import { TmaProductSpecificationModule } from './product/tma-product-specification/tma-product-specification.module';
import { TmaProductOrderModule } from '../../core/product-order';
import { SelfcareStoreModule } from '../../core/selfcare/store/selfcare-store.module';
import { UserModule } from '@spartacus/core';
import { TmaChecklistModule } from './checklist';
import { TmaBannerModule } from './content/banner/tma-banner.module';
import { UtilitiesBannersModule } from './homepage';
import { SetUpAServiceModule } from './set-up-a-service';
import { SwitchProviderModule } from './switch-provider';

@NgModule({
  imports: [
    TmaProductListModule,
    TmaProductListCarouselModule,
    TmaCommodityProductDetailsModule,
    TmaProductSummaryModule,
    TmaProductTabsModule,
    TmaCartComponentModule,
    TmaCheckoutComponentModule,
    SubscriptionComponentModule,
    TmaGuidedSellingModule,
    JourneyChecklistComponentModule,
    TmaChecklistModule,
    TmaAddressFormModule,
    TmaConsumptionModule,
    ServiceabilityBannerModule,
    ServiceabilityButtonModule,
    SetUpAServiceModule,
    TmaOrderApprovalModule,
    TmaProductSpecificationModule,
    SelfcareModule,
    UtilitiesBannersModule,
    SelfcareStoreModule,
    UserModule,
    TmaBannerModule,
    TmaProductOrderModule.forRoot(),
    SwitchProviderModule
  ],
  declarations: []
})
export class TmaCmsLibModule {}

