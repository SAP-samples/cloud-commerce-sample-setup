// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StateModule } from '@spartacus/core';
import { TmaPremiseDetailEffect } from './effects/tma-premise-detail.effect';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { TMA_PREMISE_DETAIL_FEATURE } from './tma-premise-detail.state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(TMA_PREMISE_DETAIL_FEATURE, reducerToken, { metaReducers }),
    EffectsModule.forFeature([TmaPremiseDetailEffect]),
    RouterModule
  ],
  providers: [reducerProvider]
})
export class TmaPremiseDetailStoreModule {
}
