// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { TmaProductsSearchEffects } from './effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([TmaProductsSearchEffects]),
  ],
})
export class TmaProductStoreModule {}
