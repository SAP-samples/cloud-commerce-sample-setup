// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ModuleWithProviders, NgModule } from '@angular/core';
import { SubscriptionBaseStoreModule } from './store/subscription-base-store.module';
import { SubscriptionBaseService } from './facade';

@NgModule({
  imports: [SubscriptionBaseStoreModule],
})
export class SubscriptionBaseModule {
  static forRoot(): ModuleWithProviders<SubscriptionBaseModule> {
    return {
      ngModule: SubscriptionBaseModule,
      providers: [SubscriptionBaseService],
    };
  }
}
