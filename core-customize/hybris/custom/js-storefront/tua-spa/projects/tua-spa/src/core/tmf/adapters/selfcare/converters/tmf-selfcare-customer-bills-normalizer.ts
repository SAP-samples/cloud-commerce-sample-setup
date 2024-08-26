// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaCustomerBills } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfSelfcareCustomerBillsNormalizer
  implements Converter<Tmf.TmfCustomerBills, TmaCustomerBills>
{
  /**
   * Converts {@link Tmf.TmfCustomerBills} to {@link TmaCustomerBills}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaCustomerBills}
   */
  convert(
    source: Tmf.TmfCustomerBills,
    target?: TmaCustomerBills
  ): TmaCustomerBills {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
