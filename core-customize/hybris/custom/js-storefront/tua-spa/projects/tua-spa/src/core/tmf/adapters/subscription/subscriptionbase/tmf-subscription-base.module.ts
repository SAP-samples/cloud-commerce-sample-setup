// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmfSubscriptionBaseConfig } from './default-tmf-subscription-base-config';
import { TmfSubscriptionBaseAdapter } from './tmf-subscription-base.adapter';
import { TmfSubscriptionBaseNormalizer } from './converters';
import { SUBSCRIPTION_BASE_NORMALIZER } from '../../../../subscription/subscriptionbase/connectors';
import { SubscriptionBaseAdapter } from '../../../../subscription/subscriptionbase/store/adapters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfSubscriptionBaseConfig),
  ],
  providers: [
    {
      provide: SubscriptionBaseAdapter,
      useClass: TmfSubscriptionBaseAdapter,
    },
    {
      provide: SUBSCRIPTION_BASE_NORMALIZER,
      useExisting: TmfSubscriptionBaseNormalizer,
      multi: true,
    },
  ],
})
export class TmfSubscriptionBaseModule {}
