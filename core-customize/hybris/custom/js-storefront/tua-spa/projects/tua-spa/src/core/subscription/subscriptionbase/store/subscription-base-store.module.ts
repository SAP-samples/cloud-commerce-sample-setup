// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { SubscriptionBaseEffect } from './effects/subscription-base.effect';
import { SUBSCRIPTION_BASE_FEATURE } from './subscription-base.state';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(SUBSCRIPTION_BASE_FEATURE, reducerToken, {
      metaReducers,
    }),
    EffectsModule.forFeature([SubscriptionBaseEffect]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class SubscriptionBaseStoreModule {}
