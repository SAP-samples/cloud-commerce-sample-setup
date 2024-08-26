// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ItemCounterModule, KeyboardFocusModule } from '@spartacus/storefront';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaItemCounterComponent } from './tma-item-counter.component';
import { I18nModule } from "@spartacus/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KeyboardFocusModule,
    I18nModule,
  ],
  declarations: [TmaItemCounterComponent],
  exports: [TmaItemCounterComponent]
})
export class TmaItemCounterModule extends ItemCounterModule { }
