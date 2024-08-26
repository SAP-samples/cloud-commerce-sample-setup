// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { TMF_PRODUCT_FEATURE } from './tmf-product.state';
import { TmfProductEffect } from './effects/tmf-product.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(TMF_PRODUCT_FEATURE, reducerToken, { metaReducers }),
    EffectsModule.forFeature([TmfProductEffect]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class TmfProductStoreModule {}
