// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TmaCartDetailsModule } from './cart-details/tma-cart-details.module';
import { TmaCartSharedModule } from './cart-shared';
import { OutletModule, PAGE_LAYOUT_HANDLER } from '@spartacus/storefront';
import { TmaCartTotalsModule } from './cart-totals/tma-cart-totals.module';
import {
  CartBaseComponentsModule,
  CartPageLayoutHandler,
  CartProceedToCheckoutModule,
  ClearCartModule,
  SaveForLaterModule
} from '@spartacus/cart/base/components';
import { CartBaseCoreModule } from '@spartacus/cart/base/core';
import { TmaAddedToCartDialogModule } from './add-to-cart/added-to-cart-dialog/tma-added-to-cart-dialog.module';

@NgModule({
  imports: [
    NgbModule,
    TmaCartDetailsModule,
    CartProceedToCheckoutModule,
    TmaCartTotalsModule,
    TmaCartSharedModule,
    SaveForLaterModule,
    ClearCartModule,
    OutletModule.forChild(),
  ],
  exports: [
    TmaCartDetailsModule,
    CartProceedToCheckoutModule,
    TmaCartTotalsModule,
    TmaCartSharedModule,
    SaveForLaterModule,
    ClearCartModule,
    TmaAddedToCartDialogModule,
    CartBaseCoreModule
  ],
  declarations: [],
  providers: [
    {
      provide: PAGE_LAYOUT_HANDLER,
      useExisting: CartPageLayoutHandler,
      multi: true
    }
  ]
})
export class TmaCartComponentModule extends CartBaseComponentsModule { }
