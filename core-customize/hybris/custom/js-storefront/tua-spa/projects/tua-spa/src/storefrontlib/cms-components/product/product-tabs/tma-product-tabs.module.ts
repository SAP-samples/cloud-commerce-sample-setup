// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { ProductReviewsModule, ProductTabsModule } from '@spartacus/storefront';
import { TmaProductDetailsTabModule } from './product-details-tab/tma-product-details-tab.module';
import { TmaProductAttributesModule } from './product-attributes/tma-product-attributes-module';
import { TmaProductIncludedServicesTabModule } from './product-included-services/tma-product-included-services-tab.module';

@NgModule({
  imports: [
    TmaProductAttributesModule,
    TmaProductDetailsTabModule,
    TmaProductIncludedServicesTabModule,
    ProductReviewsModule
  ]
})
export class TmaProductTabsModule extends ProductTabsModule { }
