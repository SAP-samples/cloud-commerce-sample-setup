// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StateModule } from '@spartacus/core';
import { ProductOfferingEffect } from './effects';
import { PRODUCT_OFFERING_FEATURE } from './product-offering-state';
import { reducerProvider, reducerToken } from './reducers/index';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(PRODUCT_OFFERING_FEATURE, reducerToken, {}),
    EffectsModule.forFeature([ProductOfferingEffect])
  ],
  providers: [reducerProvider]
})
export class ProductOfferingStoreModule {}
