// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ReservationEffect } from './effects';
import { RESERVATION_POOL_MANAGEMENT_FEATURE } from './reservation.state';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { metaReducers, reducerProvider, reducerToken } from './reducers/index';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(RESERVATION_POOL_MANAGEMENT_FEATURE, reducerToken, {
      metaReducers
    }),
    EffectsModule.forFeature([ReservationEffect]),
    RouterModule
  ],
  providers: [reducerProvider]
})
export class ReservationStoreModule {
}
