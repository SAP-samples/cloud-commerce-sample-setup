// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { IconModule, KeyboardFocusModule, PromotionsModule, SpinnerModule } from '@spartacus/storefront';
import { TmaItemCounterModule } from '../../../../shared';
import { TmaCartSharedModule } from '../../cart-shared';
import { AddedToCartDialogEventListener, AddedToCartDialogModule } from '@spartacus/cart/base/components';
import { TmaAddedToCartDialogComponent } from './tma-added-to-cart-dialog.component';
import { defaultAddedToCartLayoutConfig } from './default-added-to-cart-layout.config';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TmaCartSharedModule,
    RouterModule,
    SpinnerModule,
    PromotionsModule,
    UrlModule,
    IconModule,
    I18nModule,
    TmaItemCounterModule,
    KeyboardFocusModule,
  ],
  providers: [provideConfig(defaultAddedToCartLayoutConfig)],
  declarations: [TmaAddedToCartDialogComponent],
  exports: [TmaAddedToCartDialogComponent],
})
export class TmaAddedToCartDialogModule extends AddedToCartDialogModule {
  constructor(_addToCartDialogEventListener: AddedToCartDialogEventListener) {
    super(_addToCartDialogEventListener);
  }

}
