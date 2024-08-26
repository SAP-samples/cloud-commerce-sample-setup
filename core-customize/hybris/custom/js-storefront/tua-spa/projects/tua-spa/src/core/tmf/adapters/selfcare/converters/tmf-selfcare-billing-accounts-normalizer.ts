// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaBillingAccounts } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSelfcareBillingAccountsNormalizer
  implements Converter<Tmf.TmfBillingAccounts, TmaBillingAccounts>
{
  constructor() {
  }

  /**
   * Converts {@link Tmf.TmfBillingAccounts} to {@link TmaBillingAccounts}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaBillingAccounts}
   */
  convert(
    source: Tmf.TmfBillingAccounts,
    target?: TmaBillingAccounts
  ): TmaBillingAccounts {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
