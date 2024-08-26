// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { IconModule, PopoverModule, SplitViewModule } from '@spartacus/storefront';
import { TmaCardComponent } from './tma-card.component';

/**
 * Provides a reusable card UI component for the organization split views.
 *
 * The component does not intend to provide a complete set of card features, it's just
 * a reusable component inside the organization UI.
 */
@NgModule({
  imports: [
    CommonModule,
    SplitViewModule,
    RouterModule,
    I18nModule,
    IconModule,
    UrlModule,
    PopoverModule
  ],
  declarations: [TmaCardComponent],
  exports: [TmaCardComponent]
})
export class TmaCardModule {}
