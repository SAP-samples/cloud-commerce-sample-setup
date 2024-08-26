// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StateModule } from '@spartacus/core';
import { TmaCartEntryEffects } from './effects/tma-cart-entry.effect';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StateModule,
    EffectsModule.forFeature([TmaCartEntryEffects]),
    RouterModule
  ]
})
export class TmaCartStoreModule {
}
