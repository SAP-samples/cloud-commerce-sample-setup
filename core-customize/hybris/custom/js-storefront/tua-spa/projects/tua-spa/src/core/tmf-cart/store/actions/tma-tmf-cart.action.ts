// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { MULTI_CART_DATA } from '@spartacus/cart/base/core';

export enum TmaTmfCartActionTypes {
  UPDATE_CART = '[Cart] Update TMF Cart'
}

export class UpdateCart extends StateUtils.LoaderLoadAction {
  readonly type = TmaTmfCartActionTypes.UPDATE_CART;

  constructor(public payload: any) {
    super(MULTI_CART_DATA);
  }
}
