// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { OccCartNormalizer } from '@spartacus/cart/base/occ';
import { Converter, ConverterService, Occ } from '@spartacus/core';
import { TMA_PRODUCT_NORMALIZER } from '../../../../../core/product/connectors';
import { Cart } from '@spartacus/cart/base/root';

@Injectable({ providedIn: 'root' })
export class TmaOccCartNormalizer
  extends OccCartNormalizer
  implements Converter<Occ.Cart, Cart> {
  constructor(private tmaConverter: ConverterService) {
    super(tmaConverter);
  }
  convert(source: Occ.Cart, target?: Cart): Cart {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    if (source && source.entries) {
      target.entries = source.entries.map((entry) => ({
        ...entry,
        product: this.tmaConverter.convert(
          entry.product,
          TMA_PRODUCT_NORMALIZER
        ),
      }));
    }
    this.tmaRemoveDuplicatePromotions(source, target);
    return target;
  }

  /**
   * Remove Duplicate items from the promotions.
   * @param source the source
   * @param target the cart
   */
  protected tmaRemoveDuplicatePromotions(source: any, target: Cart): void {
    if (source && source.potentialOrderPromotions) {
      target.potentialOrderPromotions = this.tmaRemoveDuplicateItems(
        source.potentialOrderPromotions
      );
    }
    if (source && source.potentialProductPromotions) {
      target.potentialProductPromotions = this.tmaRemoveDuplicateItems(
        source.potentialProductPromotions
      );
    }
    if (source && source.appliedOrderPromotions) {
      target.appliedOrderPromotions = this.tmaRemoveDuplicateItems(
        source.appliedOrderPromotions
      );
    }
    if (source && source.appliedProductPromotions) {
      target.appliedProductPromotions = this.tmaRemoveDuplicateItems(
        source.appliedProductPromotions
      );
    }
  }
  private tmaRemoveDuplicateItems(itemList: any[]): any[] {
    return itemList.filter((p, i, a) => {
      const b = a.map((el) => JSON.stringify(el));
      return i === b.indexOf(JSON.stringify(p));
    });
  }
}
