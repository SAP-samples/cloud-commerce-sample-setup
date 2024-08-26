// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Converter } from '@spartacus/core';
import { TmaPaginatedProductOrder } from '../../../../model';
import { Tmf } from '../../../tmf-models';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TmfPaginatedOrderNormalizer implements Converter<Tmf.TmfPaginatedProductOrder, TmaPaginatedProductOrder> {

  /**
   * Converts {@link Tmf.TmfPaginatedProductOrder} to {@link TmaPaginatedProductOrder}.
   *
   * @param source - The object which will be used to retrieve the values
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaPaginatedProductOrder} type
   */
  convert(source: Tmf.TmfPaginatedProductOrder, target?: TmaPaginatedProductOrder): TmaPaginatedProductOrder {

    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }

}
