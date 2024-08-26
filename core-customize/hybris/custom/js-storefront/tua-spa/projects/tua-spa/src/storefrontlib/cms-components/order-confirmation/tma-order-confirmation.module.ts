// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard, ConfigModule, FeaturesConfigModule, I18nModule } from '@spartacus/core';
import { CardModule, OutletModule, PromotionsModule, PwaModule } from '@spartacus/storefront';
import { TmaCartSharedModule } from '../cart/cart-shared';
import { TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent, TmaOrderConfirmationShippingComponent } from './components';
import { OrderConfirmationGuard, OrderConfirmationModule } from '@spartacus/order/components';
import { TmaOrderOverviewComponent, TmaOrderOverviewModule } from '../../shared';

@NgModule({
  imports: [
    CommonModule,
    TmaCartSharedModule,
    CardModule,
    PwaModule,
    PromotionsModule,
    I18nModule,
    ReactiveFormsModule,
    FeaturesConfigModule,
    TmaOrderOverviewModule,
    ConfigModule.withConfig({
      cmsComponents: {
        OrderConfirmationItemsComponent: {
          component: TmaOrderConfirmationItemsComponent,
          guards: [OrderConfirmationGuard]
        },
        OrderConfirmationShippingComponent: {
          component: TmaOrderConfirmationShippingComponent,
          guards: [OrderConfirmationGuard]
        },
        OrderConfirmationTotalsComponent: {
          component: TmaOrderConfirmationTotalsComponent,
          guards: [OrderConfirmationGuard]
        },
        OrderConfirmationOverviewComponent: {
          component: TmaOrderOverviewComponent,
          guards: [AuthGuard]
        },
        AccountOrderDetailsOverviewComponent: {
          component: TmaOrderOverviewComponent,
          guards: [AuthGuard]
        }
      }
    }),
    OutletModule
  ],
  declarations: [TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent, TmaOrderConfirmationShippingComponent],
  exports: [TmaOrderConfirmationItemsComponent, TmaOrderConfirmationTotalsComponent, TmaOrderConfirmationShippingComponent]
})

export class TmaOrderConfirmationModule extends OrderConfirmationModule { }
