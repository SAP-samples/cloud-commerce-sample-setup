// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { AvailabilityCheckService } from './facade';
import { AvailabilityCheckStoreModule } from './store/availability-check-store.module';

@NgModule({
  imports: [AvailabilityCheckStoreModule]
})
export class AvailabilityCheckModule {
  static forRoot(): ModuleWithProviders<AvailabilityCheckModule> {
    return {
      ngModule: AvailabilityCheckModule,
      providers: [AvailabilityCheckService]
    };
  }
}
