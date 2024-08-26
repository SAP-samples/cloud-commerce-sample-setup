// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter, OccConfig, Product, TranslationService } from '@spartacus/core';
import { first, take } from 'rxjs/operators';
import { TmaChargeType } from '../../../../model';

@Injectable({providedIn: 'root'})
export class TmaProductPriceNormalizer
  implements Converter<any, Product> {

  constructor(protected config: OccConfig, protected translationService: TranslationService) {
  }

  convert(source: any, target?: Product): Product {
    target = target ?? {...(source as unknown as Partial<any>)};
    if (source.productOfferingPrice) {
      let currencyIso = source?.productOfferingPrice[0]?.bundledPop[0]?.price?.currencyIso;
      let currencySymbol: string = null;
      this.translationService
        .translate('common.currencies.currency', {context: currencyIso})
        .pipe(
          take(1),
          first((currency: string) => currency !== null)
        )
        .subscribe((currency: string) => (currencySymbol = currency))
      if (source.productOfferingPrice.length)
        if (source.productOfferingPrice[0].bundledPop?.length && source.productOfferingPrice[0].bundledPop[0]?.chargeType === TmaChargeType.ONE_TIME) {
          target.price = {
            formattedValue: currencySymbol + source?.productOfferingPrice[0]?.bundledPop[0]?.price?.value,
          }
        }
      return target;
    }
    return;
  }
}
