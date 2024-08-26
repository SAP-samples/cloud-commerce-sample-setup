// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { TmaProductDetailsTabComponent } from './tma-product-details-tab.component';


@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductDetailsTabComponent: {
          component: TmaProductDetailsTabComponent
        }
      }
    }),
    I18nModule,
  ],
  declarations: [TmaProductDetailsTabComponent],
  exports: [TmaProductDetailsTabComponent]
})
export class TmaProductDetailsTabModule { }
