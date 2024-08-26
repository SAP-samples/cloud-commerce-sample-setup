// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule, OutletModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { FeaturesConfigModule, I18nModule, provideDefaultConfig, UrlModule } from '@spartacus/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TmaGuidedSellingAddSelectionComponent } from './guided-selling-add-selection/tma-guided-selling-add-selection.component';
import {
  TmaGuidedSellingCurrentSelectionComponent
} from './guided-selling-current-selection/tma-guided-selling-current-selection.component';
import {
  TmaGuidedSellingAddedToCartDialogComponent
} from './guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.component';
import { TmaCartSharedModule } from '../../cart/cart-shared';
import { RouterModule } from '@angular/router';
import { TmaPriceDisplayModule } from '../../product/price/price-display/tma-price-display.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {
  defaultTmaGuidedSellingAddToCartDialogLayoutConfig
} from './guided-selling-added-to-cart-dialog/tma-guided-selling-added-to-cart-dialog.config';
import { TmaGuidedSellingMessagesComponent } from './guided-selling-messages/tma-guided-selling-messages.component';

@NgModule({
  imports: [
    CommonModule,
    OutletModule,
    I18nModule,
    BrowserAnimationsModule,
    IconModule,
    PromotionsModule,
    SpinnerModule,
    NgxSpinnerModule,
    FeaturesConfigModule,
    UrlModule,
    RouterModule,
    TmaCartSharedModule,
    TmaPriceDisplayModule
  ],
  declarations: [
    TmaGuidedSellingAddSelectionComponent,
    TmaGuidedSellingCurrentSelectionComponent,
    TmaGuidedSellingAddedToCartDialogComponent,
    TmaGuidedSellingMessagesComponent
  ],
  exports: [
    TmaGuidedSellingAddSelectionComponent,
    TmaGuidedSellingCurrentSelectionComponent,
    TmaGuidedSellingAddedToCartDialogComponent,
    TmaGuidedSellingMessagesComponent
  ],
  providers:[provideDefaultConfig(defaultTmaGuidedSellingAddToCartDialogLayoutConfig)]
})
export class TmaGuidedSellingCurrentSelectionModule { }
