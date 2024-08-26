// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';
import { SUBSCRIPTION_BASE_DETAIL_FEATURE } from './subscription-base-details.state';
import { SubscriptionBaseDetailsEffect } from './effects/subscription-base-details.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(SUBSCRIPTION_BASE_DETAIL_FEATURE, reducerToken, {
      metaReducers,
    }),
    EffectsModule.forFeature([SubscriptionBaseDetailsEffect]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class SubscriptionBaseDetailsStoreModule {}
