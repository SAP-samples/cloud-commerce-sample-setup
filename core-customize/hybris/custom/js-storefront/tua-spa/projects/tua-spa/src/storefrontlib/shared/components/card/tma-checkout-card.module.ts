// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AtMessageModule, CardModule, IconModule, KeyboardFocusModule, TruncateTextPopoverModule } from '@spartacus/storefront';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaCheckoutCardComponent } from './tma-checkout-card.component';
import { I18nModule } from '@spartacus/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    TruncateTextPopoverModule,
    IconModule,
    AtMessageModule,
    KeyboardFocusModule,
  ],
  declarations: [TmaCheckoutCardComponent],
  exports: [TmaCheckoutCardComponent]
})
export class TmaCheckoutCardModule extends CardModule { }
