// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Converter } from '@spartacus/core';
import { TmaProductOrder } from '../../../../model';
import { Tmf } from '../../../tmf-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TmfProductOrderNormalizer implements Converter<Tmf.TmfProductOrder, TmaProductOrder> {

  /**
   * Converts {@link Tmf.TmfProductOrder} to {@link TmaProductOrder}.
   *
   * @param source - The object which will be used to retrieve the values
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaProductOrder} type
   */
  convert(source: Tmf.TmfProductOrder, target?: TmaProductOrder): TmaProductOrder {

    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }

}
