// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter, ConverterService } from '@spartacus/core';
import { PRODUCT_OFFERING_PRICE_NORMALIZER } from '../../../../productoffering';
import { TmaProduct } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfProductOfferingNormalizer
  implements Converter<Tmf.TmfProductOffering, TmaProduct> {
  constructor(
    private converter: ConverterService
  ) { }

  /**
   * Converts {@link Tmf.TmfProductOffering} to {@link TmaProduct}.
   *
   * @param source - The object which will be used to retrieve the values
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaProduct}
   */
  convert(source: Tmf.TmfProductOffering, target?: TmaProduct): TmaProduct {
    if (target === undefined) {
      target = { ...(source as any) };
      target.code = source.id;
    }
    if (source.productOfferingPrice) {
      target.productOfferingPrice = source.productOfferingPrice.map(tmfProductOfferingPrice => ({
        ...tmfProductOfferingPrice,
        bundledPop: this.converter.convert(tmfProductOfferingPrice.bundledPop, PRODUCT_OFFERING_PRICE_NORMALIZER),
      }));
    }
    return target;
  }
}
