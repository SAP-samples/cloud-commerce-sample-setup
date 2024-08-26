// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ConfigModule,
  OccProductAdapter,
  OccProductReferencesAdapter,
  OccProductReviewsAdapter,
  ProductAdapter,
  ProductOccModule,
  ProductReferencesAdapter,
  ProductReviewsAdapter,
  ProductSearchAdapter,
  PRODUCT_NORMALIZER
} from '@spartacus/core';
import { defaultTmaOccProductConfig } from './default-tma-occ-product-config';
import {
  TmaOccProductReferencesListNormalizer,
  TmaOccProductSearchPageNormalizer,
  TmaProductImageNormalizer,
  TmaProductNameNormalizer
} from './converters';
import { TMA_PRODUCT_NORMALIZER } from '../../../product/connectors/product/converters';
import { TMA_PRODUCT_REFERENCES_NORMALIZER } from '../../../product/connectors/references/converters';
import { TmaOccProductSearchAdapter } from './tma-occ-product-search.adapter';
import { TMA_PRODUCT_SEARCH_PAGE_NORMALIZER } from '../../../product';
import { TmaProductPriceNormalizer } from './converters/tma-product-price-normalizer';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmaOccProductConfig)
  ],
  providers: [
    {
      provide: ProductAdapter,
      useClass: OccProductAdapter
    },
    {
      provide: TMA_PRODUCT_NORMALIZER,
      useExisting: TmaProductImageNormalizer,
      multi: true
    },
    {
      provide: TMA_PRODUCT_NORMALIZER,
      useExisting: TmaProductNameNormalizer,
      multi: true
    },
    {
      provide: PRODUCT_NORMALIZER,
      useExisting: TmaProductPriceNormalizer,
      multi: true
    },
    {
      provide: ProductReferencesAdapter,
      useClass: OccProductReferencesAdapter
    },
    {
      provide: TMA_PRODUCT_REFERENCES_NORMALIZER,
      useExisting: TmaOccProductReferencesListNormalizer,
      multi: true
    },
    {
      provide: ProductSearchAdapter,
      useClass: TmaOccProductSearchAdapter
    },
    {
      provide: TMA_PRODUCT_SEARCH_PAGE_NORMALIZER,
      useExisting: TmaOccProductSearchPageNormalizer,
      multi: true
    },
    {
      provide: ProductReviewsAdapter,
      useClass: OccProductReviewsAdapter
    }
  ]
})
export class TmaOccProductModule extends ProductOccModule {}
