// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TmfProductAdapterImpl } from './tmf-product-impl.adapter';
import { TmfProductNormalizer } from './converters';
import { TmfProductAdapter } from '../../../../subscription/tmf-product/store/adapters';
import { defaultTmfProductConfig } from './default-tmf-product-config';
import { TMF_PRODUCT_NORMALIZER } from '../../../../subscription/tmf-product';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfProductConfig),
  ],
  providers: [
    {
      provide: TmfProductAdapter,
      useClass: TmfProductAdapterImpl,
    },
    {
      provide: TMF_PRODUCT_NORMALIZER,
      useExisting: TmfProductNormalizer,
      multi: true,
    },
  ],
})
export class TmfProductAdapterModule {}
