// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { SearchTimeSlotService } from './facade';
import { SearchTimeSlotStoreModule } from './store/search-time-slot-store.module';

@NgModule({
  imports: [SearchTimeSlotStoreModule]
})
export class SearchTimeSlotModule {
  static forRoot(): ModuleWithProviders<SearchTimeSlotModule> {
    return {
      ngModule: SearchTimeSlotModule,
      providers: [SearchTimeSlotService]
    };
  }
}
