// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createSelector, MemoizedSelector } from '@ngrx/store';
import { TmaOrderEntry } from '../../../model';
import { MultiCartSelectors, StateWithMultiCart } from '@spartacus/cart/base/core';

/**
 * Returns cart entry for provided entry number
 *
 * @param cartId - The identifier of the cart
 * @param entryNumber - The number of the entry
 */
export const getCartEntryForEntryNumberSelectorFactory = (cartId: string, entryNumber: number): MemoizedSelector<StateWithMultiCart, TmaOrderEntry> => {
  return createSelector(
    MultiCartSelectors.getCartEntriesSelectorFactory(cartId),
    (state: TmaOrderEntry[]) => {
      return state ? state.find(entry => entry.entryNumber === entryNumber) : undefined;
    }
  );
};

/**
 * Returns the SPO cart entry which has the highest entry number for the provided product code
 *
 * @param cartId - The identifier of the cart
 * @param productCode - The identifier of the product
 */
export const getSpoWithHighestEntryNumberSelectorFactory = (cartId: string, productCode: string): MemoizedSelector<StateWithMultiCart, TmaOrderEntry> => {
  return createSelector(
    MultiCartSelectors.getCartEntriesSelectorFactory(cartId),
    (state: TmaOrderEntry[]) => {
      const spoForProductCodeList: TmaOrderEntry[] = state.filter((entry: TmaOrderEntry) => entry.product.code === productCode && !entry.rootBpoCode) || [];
      const highestEntryNumber: number = Math.max.apply(Math, spoForProductCodeList.map(function (entry: TmaOrderEntry) {
        return entry.entryNumber;
      }));
      return state ? state.find(entry => entry.entryNumber === highestEntryNumber) : undefined;
    }
  );
};
