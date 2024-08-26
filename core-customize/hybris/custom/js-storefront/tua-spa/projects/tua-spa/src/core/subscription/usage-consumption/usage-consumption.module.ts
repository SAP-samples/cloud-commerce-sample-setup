// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsageConsumptionService } from './facade';
import { UsageConsumptionStoreModule } from './store/usage-consumption.store.module';

@NgModule({
  imports: [CommonModule, UsageConsumptionStoreModule],
})
export class UsageConsumptionModule {
  static forRoot(): ModuleWithProviders<UsageConsumptionModule> {
    return {
      ngModule: UsageConsumptionModule,
      providers: [UsageConsumptionService],
    };
  }
}
