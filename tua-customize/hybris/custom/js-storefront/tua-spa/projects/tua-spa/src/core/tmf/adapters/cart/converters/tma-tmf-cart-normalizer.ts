// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaTmfShoppingCart } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmaTmfCartNormalizer implements Converter<Tmf.TmaTmfShoppingCart, TmaTmfShoppingCart> {

  constructor() {
  }

  /**
   * Converts {@link Tmf.TmaTmfShoppingCart} to {@link TmaTmfShoppingCart}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return A {@link TmaTmfShoppingCart}
   */
  convert(source: Tmf.TmaTmfShoppingCart, target?: TmaTmfShoppingCart): TmaTmfShoppingCart {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
