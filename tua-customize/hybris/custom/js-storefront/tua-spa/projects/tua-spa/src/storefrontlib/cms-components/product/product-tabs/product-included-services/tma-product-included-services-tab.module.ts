// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { MediaModule } from '@spartacus/storefront';
import { TmaProductIncludedServicesTabComponent } from './tma-product-included-services-tab.component';

@NgModule({
    imports: [
      CommonModule,
      ConfigModule.withConfig({
        cmsComponents: {
          ProductIncludedServicesTabComponent: {
            component: TmaProductIncludedServicesTabComponent
          }
        }
      }),
      I18nModule,
      MediaModule,
    ],
    declarations: [TmaProductIncludedServicesTabComponent],
    exports: [TmaProductIncludedServicesTabComponent]
  })
  export class TmaProductIncludedServicesTabModule { }
