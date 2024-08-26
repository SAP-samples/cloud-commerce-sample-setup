// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Tmf } from '../../../..';
import { TmfProduct } from '../../../../../model';

@Injectable({ providedIn: 'root' })
export class TmfProductNormalizer
  implements Converter<Tmf.TmfProduct, TmfProduct> {
  constructor() {
  }

  convert(source: Tmf.TmfProduct, target?: TmfProduct): TmfProduct {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
