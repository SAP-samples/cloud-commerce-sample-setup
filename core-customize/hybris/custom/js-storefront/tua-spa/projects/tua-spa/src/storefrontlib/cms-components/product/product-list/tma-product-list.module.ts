// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigModule, FeaturesConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  defaultViewConfig,
  IconModule,
  ItemCounterModule,
  ListNavigationModule,
  MediaModule,
  OutletModule,
  PageComponentModule,
  ProductListModule,
  SpinnerModule,
  StarRatingModule
} from '@spartacus/storefront';
import { TmaProductListComponent } from './container/tma-product-list.component';
import { TmaProductListItemComponent } from './product-list-item/tma-product-list-item.component';
import { TmaProductGridItemComponent } from './product-grid-item/tma-product-grid-item.component';
import { TmaProductScrollComponent } from './container/product-scroll/tma-product-scroll.component';
import { TmaProductViewComponent } from './product-view/tma-product-view.component';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { QueryServiceQualificationModule } from '../../../../core';
import { TmaConsumptionModule } from '../../consumption';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    ConfigModule.withConfig(defaultViewConfig),
    ConfigModule.withConfig({
      cmsComponents: {
        CMSProductListComponent: {
          component: TmaProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent']
            }
          }
        },
        ProductGridComponent: {
          component: TmaProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent']
            }
          }
        },
        SearchResultsListComponent: {
          component: TmaProductListComponent,
          data: {
            composition: {
              inner: ['ProductAddToCartComponent']
            }
          }
        }
      }
    }),
    RouterModule,
    MediaModule,
    ItemCounterModule,
    ListNavigationModule,
    UrlModule,
    I18nModule,
    StarRatingModule,
    IconModule,
    SpinnerModule,
    InfiniteScrollModule,
    FeaturesConfigModule,
    TmaPriceDisplayModule,
    QueryServiceQualificationModule,
    PageComponentModule,
    TmaConsumptionModule
  ],
  declarations: [
    TmaProductListComponent,
    TmaProductListItemComponent,
    TmaProductGridItemComponent,
    TmaProductViewComponent,
    TmaProductScrollComponent
  ],
  exports: [
    TmaProductListComponent,
    TmaProductListItemComponent,
    TmaProductGridItemComponent,
    TmaProductViewComponent,
    TmaProductScrollComponent
  ]
})
export class TmaProductListModule extends ProductListModule {}
