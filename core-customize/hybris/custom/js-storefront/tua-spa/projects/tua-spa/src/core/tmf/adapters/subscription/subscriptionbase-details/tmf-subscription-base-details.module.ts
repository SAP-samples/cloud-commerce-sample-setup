// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ConfigModule } from '@spartacus/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { defaultTmfSubscriptionBaseDetailsConfig } from './default-tmf-subscription-base-details-config';
import { TmfSubscriptionBaseDetailsAdapter } from './tmf-subscription-base-details.adapter';
import { TmfSubscriptionBaseDetailsNormalizer } from './converters';
import { SUBSCRIPTION_BASE_DETAIL_NORMALIZER } from '../../../../subscription/subscriptionbase-details/connectors';
import { SubscriptionBaseDetailsAdapter } from '../../../../subscription/subscriptionbase-details/store/adapters';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    ConfigModule.withConfig(defaultTmfSubscriptionBaseDetailsConfig),
  ],
  providers: [
    {
      provide: SubscriptionBaseDetailsAdapter,
      useClass: TmfSubscriptionBaseDetailsAdapter,
    },
    {
      provide: SUBSCRIPTION_BASE_DETAIL_NORMALIZER,
      useExisting: TmfSubscriptionBaseDetailsNormalizer,
      multi: true,
    },
  ],
})
export class TmfSubscriptionBaseDetailsModule {}
