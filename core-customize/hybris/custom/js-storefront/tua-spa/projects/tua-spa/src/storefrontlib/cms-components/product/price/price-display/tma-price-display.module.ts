// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaPriceDisplayComponent } from './tma-price-display.component';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaPriceModule } from '../tma-price.module';
import { TmaAlterationDetailsModule } from '../alterations-details/tma-alteration-details.module';
import {
  CartItemAlterationsDetailsModule
} from '../../../cart/cart-shared/cart-item-price/cart-item-alterations-details/cart-item-alterations-details.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    NgbModule,
    TmaPriceModule,
    TmaAlterationDetailsModule,
    CartItemAlterationsDetailsModule
  ],
  declarations: [TmaPriceDisplayComponent],
  exports: [TmaPriceDisplayComponent]
})
export class TmaPriceDisplayModule {}
