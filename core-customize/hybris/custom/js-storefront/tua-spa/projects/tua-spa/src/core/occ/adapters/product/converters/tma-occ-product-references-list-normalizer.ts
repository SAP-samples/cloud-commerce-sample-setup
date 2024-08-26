// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter, ConverterService, Occ, OccProductReferencesListNormalizer, ProductReference } from '@spartacus/core';
import { TMA_PRODUCT_NORMALIZER } from '../../../../../core/product/connectors';

@Injectable({ providedIn: 'root' })
export class TmaOccProductReferencesListNormalizer
  extends OccProductReferencesListNormalizer
  implements Converter<Occ.ProductReferenceList, ProductReference[]> {
  constructor(private tmaConverter: ConverterService) {
    super(tmaConverter);
  }

  convert(
    source: Occ.ProductReferenceList,
    target: ProductReference[] = []
  ): ProductReference[] {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    if (source && source.references) {
      return source.references.map((reference) => ({
        ...reference,
        target: this.tmaConverter.convert(
          reference.target,
          TMA_PRODUCT_NORMALIZER
        ),
      }));
    }
    return target;
  }
}
