// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule, IconModule, SpinnerModule, StructuredDataModule } from '@spartacus/storefront';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { TmaTechnicalIdFormComponent } from './tma-technical-id-form.component';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    StructuredDataModule,
    NgSelectModule,
    ReactiveFormsModule,
    IconModule,
    SpinnerModule,
    FormErrorsModule,
  ],
  declarations: [TmaTechnicalIdFormComponent],
  exports: [TmaTechnicalIdFormComponent],
})
export class TmaTechnicalIdFormModule {
}
