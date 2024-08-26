// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { OutletModule, ProductSummaryModule, SpinnerModule } from '@spartacus/storefront';
import { TmaProductSummaryComponent } from './tma-product-summary.component';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { TmaConsumptionModule } from '../../consumption';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    SpinnerModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSummaryComponent: {
          component: TmaProductSummaryComponent
        }
      }
    }),
    TmaPriceDisplayModule,
    TmaConsumptionModule
  ],
  declarations: [TmaProductSummaryComponent],
  exports: [TmaProductSummaryComponent]
})
export class TmaProductSummaryModule extends ProductSummaryModule {
}
