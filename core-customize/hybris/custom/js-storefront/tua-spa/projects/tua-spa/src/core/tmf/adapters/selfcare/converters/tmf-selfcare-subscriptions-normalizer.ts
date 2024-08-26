// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaSubscriptions } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSelfcareSubscriptionsNormalizer
  implements Converter<Tmf.TmfSubscriptions, TmaSubscriptions>
{
  constructor() {
  }

  /**
   * Converts {@link Tmf.TmfSubscriptions} to {@link TmaSubscriptions}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaSubscriptions}
   */
  convert(
    source: Tmf.TmfSubscriptions,
    target?: TmaSubscriptions
  ): TmaSubscriptions {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
