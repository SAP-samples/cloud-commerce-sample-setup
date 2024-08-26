// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { reducerProvider, reducerToken } from './reducers/index';
import { SEARCH_TIME_SLOT_FEATURE } from './search-time-slot.state';
import { SearchTimeSlotEffect } from './effects';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(SEARCH_TIME_SLOT_FEATURE, reducerToken, {}),
    EffectsModule.forFeature([SearchTimeSlotEffect]),
    RouterModule
  ],
  providers: [reducerProvider]
})
export class SearchTimeSlotStoreModule {
}
