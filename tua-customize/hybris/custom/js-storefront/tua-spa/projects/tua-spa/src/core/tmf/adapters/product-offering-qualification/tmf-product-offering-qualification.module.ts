// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigModule } from '@spartacus/core';
import {
  PRODUCT_OFFERING_QUALIFICATION_NORMALIZER,
  ProductOfferingQualificationAdapter
} from '../../../product-offering-qualification';
import { TmfProductOfferingQualificationNormalizer } from './converters';
import { defaultTmfProductOfferingQualificationConfig } from './default-tmf-product-offering-qualification.config';
import { TmfProductOfferingQualificationAdapter } from './tmf-product-offering-qualification.adapter';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfProductOfferingQualificationConfig)
  ],
  providers: [
    {
      provide: ProductOfferingQualificationAdapter,
      useClass: TmfProductOfferingQualificationAdapter
    },
    {
      provide: PRODUCT_OFFERING_QUALIFICATION_NORMALIZER,
      useExisting: TmfProductOfferingQualificationNormalizer,
      multi: true
    }
  ]
})
export class TmfProductOfferingQualificationModule {}
