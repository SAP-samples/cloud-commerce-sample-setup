// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { OutletModule } from '@spartacus/storefront';
import { TmaGuidedSellingStepsComponent } from './tma-guided-selling-steps.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule
  ],
  declarations: [TmaGuidedSellingStepsComponent],
  exports: [TmaGuidedSellingStepsComponent]
})
export class TmaGuidedSellingStepsModule { }
