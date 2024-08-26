// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateModule } from '@spartacus/core';
import { StoreModule } from '@ngrx/store';
import { reducerProvider, reducerToken } from './reducers';
import { TMA_ADD_TO_CART_ACTION_FEATURE } from './tma-add-to-cart-action.state';


@NgModule({
  imports: [
    CommonModule,
    StateModule,
    StoreModule.forFeature(TMA_ADD_TO_CART_ACTION_FEATURE, reducerToken),
  ],
  providers: [reducerProvider],
})
export class TmaAddToCartStoreModule {}
