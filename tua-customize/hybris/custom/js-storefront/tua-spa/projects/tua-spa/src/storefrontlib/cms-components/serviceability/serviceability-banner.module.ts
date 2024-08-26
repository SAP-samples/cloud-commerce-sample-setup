// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { MediaModule, OutletModule } from '@spartacus/storefront';
import { TmaAddressFormModule } from '../address-form';
import { ProductDetailsDialogModule } from '../product/product-details-dialog/product-details-dialog.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ServiceabilityBannerComponent } from './serviceability-banner.component';
import { ServiceabilityFormModule } from './serviceability-form/serviceability-form.module';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    MediaModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    TmaAddressFormModule,
    FormsModule,
    ProductDetailsDialogModule,
    ServiceabilityFormModule,
    ConfigModule.withConfig({
      cmsComponents: {
        TmaServiceabilityBannerComponent: {
          component: ServiceabilityBannerComponent
        }
      }
    })
  ],
  declarations: [ServiceabilityBannerComponent],
  exports: [ServiceabilityBannerComponent]
})
export class ServiceabilityBannerModule {}
