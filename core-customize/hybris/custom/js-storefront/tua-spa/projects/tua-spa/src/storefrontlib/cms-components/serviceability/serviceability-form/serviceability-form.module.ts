// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { I18nModule, provideConfig } from '@spartacus/core';
import { FormErrorsModule, IconModule, KeyboardFocusModule } from '@spartacus/storefront';
import { ServiceabilityFormComponent } from './serviceability-form.component';
import { defaultServiceabilityFormLayoutConfig } from './serviceability-form-layout.config';
import { TmaAddressFormModule } from '../../address-form';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormErrorsModule,
    I18nModule,
    IconModule,
    KeyboardFocusModule,
    TmaAddressFormModule,
    NgxSpinnerModule
  ],
  providers:[provideConfig(defaultServiceabilityFormLayoutConfig)],
  declarations: [ServiceabilityFormComponent],
  exports: [ServiceabilityFormComponent],
})
export class ServiceabilityFormModule {}
