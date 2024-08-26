// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaGuidedSellingStepsModule } from './guided-selling-steps/tma-guided-selling-steps.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutletModule } from '@spartacus/storefront';
import { ConfigModule, I18nModule } from '@spartacus/core';
import { TmaGuidedSellingComponent } from './tma-guided-selling.component';
import { TmaGuidedSellingContentModule } from './guided-selling-content';
import { TmaGuidedSellingCurrentSelectionModule } from './guided-selling-current-selection';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    TmaGuidedSellingStepsModule,
    TmaGuidedSellingContentModule,
    TmaGuidedSellingCurrentSelectionModule,
    ConfigModule.withConfig({
      cmsComponents: {
        GuidedSellingComponent: {
          component: TmaGuidedSellingComponent
        }
      }
    })
  ],
  exports: [
    TmaGuidedSellingComponent,
    TmaGuidedSellingStepsModule,
    TmaGuidedSellingContentModule,
    TmaGuidedSellingCurrentSelectionModule
  ],
  declarations: [TmaGuidedSellingComponent]
})
export class TmaGuidedSellingModule { }
