// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule, UrlModule } from '@spartacus/core';
import { TmfProductComponent } from './tmf-product.component';
import { TmfProductService } from '../../../../../core/subscription/tmf-product';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerModule } from '@spartacus/storefront';
import {
  TmaCartItemPriceDisplayModule
} from '../../../cart/cart-shared/cart-item-price-display/tma-cart-item-price-display.module';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    I18nModule,
    RouterModule,
    UrlModule,
    SpinnerModule,
    TmaCartItemPriceDisplayModule
  ],
  providers: [TmfProductService],
  declarations: [TmfProductComponent],
  exports: [TmfProductComponent]
})
export class TmfProductComponentModule {}
