// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { TMA_CHECKLIST_ACTION_FEATURE } from './tma-checklist-action.state';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { TmaChecklistActionEffect } from './effects/tma-checklist-action.effect';
import { metaReducers, reducerProvider, reducerToken } from './reducers/checklist-action.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    StoreModule.forFeature(TMA_CHECKLIST_ACTION_FEATURE, reducerToken, {
      metaReducers,
    }),
    EffectsModule.forFeature([TmaChecklistActionEffect]),
    RouterModule,
  ],
  providers: [reducerProvider],
})
export class TmaChecklistActionStoreModule {}
