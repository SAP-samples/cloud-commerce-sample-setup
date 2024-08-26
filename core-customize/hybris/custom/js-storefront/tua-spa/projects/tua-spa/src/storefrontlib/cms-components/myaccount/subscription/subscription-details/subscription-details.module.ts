// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionDetailsComponent } from './subscription-details.component';
import { AuthGuard, CmsConfig, ConfigModule, I18nModule, UrlModule } from '@spartacus/core';
import { RouterModule } from '@angular/router';
import { TmfProductComponentModule } from '../tmf-product/tmf-product.module';
import { SpinnerModule } from '@spartacus/storefront';
import { RenewSubscriptionBannerModule } from '../renew-subscription-banner';
import { TerminateSubscriptionModule } from './terminate-subscription/terminate-subscription.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaCheckoutQueryService } from '../../../../../core/checkout/facade/tma-checkout-query.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    I18nModule,
    RouterModule,
    UrlModule,
    SpinnerModule,
    ConfigModule.withConfig(<CmsConfig>{
      cmsComponents: {
        AccountSubscriptionDetailsComponent: {
          canActivate: [AuthGuard],
          component: SubscriptionDetailsComponent
        }
      }
    }),
    TmfProductComponentModule,
    RenewSubscriptionBannerModule,
    TerminateSubscriptionModule
  ],
  providers: [
    TmaCheckoutQueryService
  ],
  declarations: [SubscriptionDetailsComponent],
  exports: [SubscriptionDetailsComponent]
})
export class SubscriptionDetailsModule { }
