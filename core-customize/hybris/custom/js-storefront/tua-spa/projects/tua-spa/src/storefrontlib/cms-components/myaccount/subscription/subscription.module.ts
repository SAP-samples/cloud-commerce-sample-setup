// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { UsageConsumptionComponentModule } from './usage-consumption';
import { TmfProductComponentModule } from './tmf-product';
import { SubscriptionDetailsModule } from './subscription-details/subscription-details.module';
import { SubscriptionBaseListModule } from './subscriptionbase-list/subscriptionbase-list.module';

@NgModule({
  imports: [
    SubscriptionBaseListModule,
    TmfProductComponentModule,
    UsageConsumptionComponentModule,
    SubscriptionDetailsModule
  ],
  declarations: [],
})
export class SubscriptionComponentModule {}
