// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { AVAILABILITY_CHECK_FEATURE } from './availability-check.state';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AvailabilityCheckEffect } from './effects/availability-check.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(AVAILABILITY_CHECK_FEATURE, reducerToken, {
      metaReducers
    }),
    EffectsModule.forFeature([AvailabilityCheckEffect]),
    RouterModule
  ],
  providers: [reducerProvider]
})
export class AvailabilityCheckStoreModule {
}
