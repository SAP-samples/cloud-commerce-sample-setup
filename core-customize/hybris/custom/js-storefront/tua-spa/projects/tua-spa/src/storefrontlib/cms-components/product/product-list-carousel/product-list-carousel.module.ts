// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsConfig, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { TmaProductListCarouselComponent } from './product-list-carousel.component';
import {
  CarouselModule,
  IconModule,
  MediaModule,
  ProductCarouselModule
} from '@spartacus/storefront';
import { RouterModule } from '@angular/router';
import { TmaAddToCartModule } from '../../cart';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    CarouselModule,
    MediaModule,
    RouterModule,
    UrlModule,
    IconModule,
    ProductCarouselModule,
    TmaAddToCartModule
  ],
  declarations: [TmaProductListCarouselComponent],
  exports: [TmaProductListCarouselComponent],
  providers: [
    provideConfig(<CmsConfig> {
      cmsComponents: {
        ProductListCarouselComponent: {
          component: TmaProductListCarouselComponent
        }
      }
    })
  ]
})
export class TmaProductListCarouselModule {}
