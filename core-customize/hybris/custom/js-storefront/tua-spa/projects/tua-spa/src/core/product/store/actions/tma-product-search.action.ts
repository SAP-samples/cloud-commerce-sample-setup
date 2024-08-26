// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';
import { ProductSearchPage, SearchConfig } from '@spartacus/core';

export const TMA_SEARCH_PRODUCTS = '[Product] Tma Search Products';
export const TMA_SEARCH_PRODUCTS_SUCCESS =
  '[Product] Tma Search Products Success';
export class TmaSearchProducts implements Action {
  readonly type = TMA_SEARCH_PRODUCTS;
  constructor(
    public payload: { queryText: string[]; searchConfig: SearchConfig },
    public auxiliary?: boolean
  ) {}
}

export class TmaSearchProductsSuccess implements Action {
  readonly type = TMA_SEARCH_PRODUCTS_SUCCESS;
  constructor(
    public payload: ProductSearchPage[],
    public auxiliary?: boolean
  ) {}
}

export type TmaProductSearchAction =
  | TmaSearchProducts
  | TmaSearchProductsSuccess;
