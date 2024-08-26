// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { SubscriptionBaseModule } from './subscriptionbase';
import { SubscriptionBaseDetailsModule } from './subscriptionbase-details';
import { UsageConsumptionModule } from './usage-consumption';
import { TmfProductModule } from './tmf-product';

@NgModule({
  imports: [
    SubscriptionBaseModule,
    SubscriptionBaseDetailsModule,
    TmfProductModule,
    UsageConsumptionModule,
  ],
})
export class SubscriptionModule {}
