// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter, ConverterService } from '@spartacus/core';
import { TmaProductOfferingPrice } from '../../../../model';
import { Tmf } from '../../../tmf-models';
import { PRODUCT_OFFERING_PRICE_NORMALIZER } from '../../../../productoffering';

@Injectable({ providedIn: 'root' })
export class TmfProductOfferingPriceNormalizer
  implements
    Converter<Tmf.TmfProductOfferingPrice[], TmaProductOfferingPrice[]> {
  constructor(private converter: ConverterService) {}

  /**
   * Converts {@link Tmf.TmfProductOffering} to {@link TmaProductOfferingPrice[]}.
   *
   * @param source - The object which will be used to retrieve the values
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaProductOfferingPrice[]}
   */
  convert(
    source: Tmf.TmfProductOfferingPrice[],
    target?: TmaProductOfferingPrice[]
  ): TmaProductOfferingPrice[] {
    if (target === undefined) {
      target = [...(source as any)];
    }
    if (source && source.length > 0) {
      for (let i = 0; i < source.length; i++) {
        if (source[i].isBundle) {
          target[i].bundledPop = this.converter.convert(
            source[i].bundledPop,
            PRODUCT_OFFERING_PRICE_NORMALIZER
          );
        } else {
          target[i].chargeType = source[i].priceType;
          target[i].billingEvent = source[i].priceEvent;
          target[i].isPercentage = source[i].percentage ? true : false;
          target[i].price = {
            value: source[i].percentage
              ? source[i].percentage
              : source[i].price.value,
            currencyIso: source[i].price ? source[i].price.unit : undefined
          };
        }
      }
    }
    return target;
  }
}
