// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducerProvider, reducerToken } from './reducers/index';
import { RecommendationEffect } from './effects';
import { RECOMMENDATION_FEATURE } from './recommendation.state';

@NgModule({
  imports: [
    CommonModule,
    StateModule,
    StoreModule.forFeature(RECOMMENDATION_FEATURE, reducerToken, {}),
    EffectsModule.forFeature([RecommendationEffect])
  ],
  providers: [reducerProvider]
})
export class RecommendationStoreModule {}
