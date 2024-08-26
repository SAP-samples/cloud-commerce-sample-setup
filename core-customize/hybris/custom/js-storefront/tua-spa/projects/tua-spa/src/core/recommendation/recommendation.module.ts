// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { RecommendationService } from './facade';
import { RecommendationStoreModule } from './store/recommendation-store.module';

@NgModule({
  imports: [RecommendationStoreModule]
})
export class RecommendationModule {
  static forRoot(): ModuleWithProviders<RecommendationModule> {
    return {
      ngModule: RecommendationModule,
      providers: [RecommendationService]
    };
  }
}
