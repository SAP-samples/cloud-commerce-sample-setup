// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { TmaProductAttributesComponent } from './tma-product-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        ProductSpecsTabComponent: {
          component: TmaProductAttributesComponent
        }
      }
    }),
    I18nModule
  ],
  declarations: [TmaProductAttributesComponent],
  exports: [TmaProductAttributesComponent]
})
export class TmaProductAttributesModule {}
