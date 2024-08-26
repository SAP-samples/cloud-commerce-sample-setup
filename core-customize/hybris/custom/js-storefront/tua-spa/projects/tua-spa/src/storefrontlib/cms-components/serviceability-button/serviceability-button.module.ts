// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigModule, I18nModule, provideConfig } from '@spartacus/core';
import { MediaModule, OutletModule } from '@spartacus/storefront';
import { TmaAddressFormModule } from '../address-form';
import { ProductDetailsDialogModule } from '../product/product-details-dialog/product-details-dialog.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ServiceabilityButtonComponent } from './serviceability-button.component';
import { ServiceabilityBannerModule } from '../serviceability';
import { ServiceabilityCategoryFormComponent } from './serviceability-category-form/serviceability-category-form.component';
import {
  defaultServiceabilityCategoryFormLayoutConfig
} from './serviceability-category-form/serviceability-category-form-layout.config';

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
    ServiceabilityBannerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ServiceabilityButtonComponent: {
          component: ServiceabilityButtonComponent
        }
      }
    })
  ],
  declarations: [
    ServiceabilityButtonComponent,
    ServiceabilityCategoryFormComponent
  ],
  providers:[provideConfig(defaultServiceabilityCategoryFormLayoutConfig)],
  exports: [ServiceabilityButtonComponent]
})
export class ServiceabilityButtonModule {}
