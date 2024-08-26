// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { DependentProductComponent } from './dependent-product.component';
import { AsyncPipe, CommonModule } from '@angular/common';
import { I18nModule, UrlModule } from '@spartacus/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    AsyncPipe,
    I18nModule,
    FormsModule,
    UrlModule,
    RouterLink
  ],
  declarations: [DependentProductComponent],
  exports: [DependentProductComponent]
})
export class DependentProductModule {
}
