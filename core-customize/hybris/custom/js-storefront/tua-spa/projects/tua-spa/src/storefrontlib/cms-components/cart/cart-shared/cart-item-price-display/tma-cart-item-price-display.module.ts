// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TmaCartItemPriceDisplayComponent } from './tma-cart-item-price-display.component';
import { I18nModule } from '@spartacus/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartItemPriceModule } from '../cart-item-price';
import {
  CartItemAlterationsDetailsModule
} from '../cart-item-price/cart-item-alterations-details/cart-item-alterations-details.module';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, I18nModule, NgbModule, CartItemPriceModule, CartItemAlterationsDetailsModule],
  declarations: [TmaCartItemPriceDisplayComponent],
  exports: [TmaCartItemPriceDisplayComponent]
})
export class TmaCartItemPriceDisplayModule {}
