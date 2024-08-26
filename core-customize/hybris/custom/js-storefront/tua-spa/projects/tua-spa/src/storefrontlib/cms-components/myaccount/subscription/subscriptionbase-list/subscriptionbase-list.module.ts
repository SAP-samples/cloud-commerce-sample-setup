// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthGuard, CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { SubscriptionBaseListComponent } from './subscriptionbase-list.component';
import { SubscriptionBaseService } from '../../../../../core/subscription/subscriptionbase/facade';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionBaseDetailsService } from '../../../../../core/subscription/subscriptionbase-details/facade';
import { UsageConsumptionComponentModule } from '../usage-consumption';
import { UsageConsumptionService } from '../../../../../core/subscription';
import { RouterModule } from '@angular/router';
import { TmfProductComponentModule } from '../tmf-product';
import { RenewSubscriptionComponentModule } from '../renew-subscription';

@NgModule({
  imports: [
    UrlModule,
    RouterModule,
    CommonModule,
    I18nModule,
    NgbModule,
    UsageConsumptionComponentModule,
    RenewSubscriptionComponentModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountSubscriptionComponent: {
          canActivate: [AuthGuard],
          component: SubscriptionBaseListComponent,
        },
      },
    }),
    TmfProductComponentModule
  ],
  providers: [
    SubscriptionBaseService,
    SubscriptionBaseDetailsService,
    UsageConsumptionService,
  ],
  declarations: [SubscriptionBaseListComponent],
  exports: [SubscriptionBaseListComponent]
})
export class SubscriptionBaseListModule {}
