// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { USAGE_CONSUMPTION_FEATURE } from './usage-consumption.state';
import { UsageConsumptionEffect } from './effects/usage-consumption.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(USAGE_CONSUMPTION_FEATURE, reducerToken, {
      metaReducers,
    }),
    EffectsModule.forFeature([UsageConsumptionEffect]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class UsageConsumptionStoreModule {}
