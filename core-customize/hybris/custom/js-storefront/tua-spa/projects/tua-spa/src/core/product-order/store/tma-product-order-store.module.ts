// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TMA_PRODUCT_ORDER_FEATURE } from './tma-product-order.state';
import { TmaProductOrderEffects } from './effects/tma-product-order.effect';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducerProvider, reducerToken } from './reducers';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(TMA_PRODUCT_ORDER_FEATURE, reducerToken, {}),
    EffectsModule.forFeature([TmaProductOrderEffects])
  ],
  providers: [reducerProvider]
})
export class TmaProductOrderStoreModule {
}
