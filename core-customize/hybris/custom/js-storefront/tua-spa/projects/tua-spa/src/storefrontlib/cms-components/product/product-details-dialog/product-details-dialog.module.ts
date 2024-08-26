// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nModule, provideConfig } from '@spartacus/core';
import { TmaPriceDisplayModule } from '../price/price-display/tma-price-display.module';
import { MediaModule } from '@spartacus/storefront';
import { TmaAddToCartModule } from '../../cart/add-to-cart/tma-add-to-cart.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';
import { defaultProductDetailsDialogLayoutConfig } from './product-details-dialog.config';

@NgModule({
  imports: [
    CommonModule,
    I18nModule,
    TmaPriceDisplayModule,
    MediaModule,
    NgxSpinnerModule,
    TmaAddToCartModule
  ],
  providers:[provideConfig(defaultProductDetailsDialogLayoutConfig)],
  declarations: [ProductDetailsDialogComponent],
  exports: [ProductDetailsDialogComponent]
})
export class ProductDetailsDialogModule {}
