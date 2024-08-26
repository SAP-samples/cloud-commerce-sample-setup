// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaBillingAgreements } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root'})
export class TmfSelfcareBillingAgreementsNormalizer
      implements Converter<Tmf.TmfBillingAgreements, TmaBillingAgreements>
{
  constructor() {
  }

  /**
   * Converts {@link Tmf.TmfBillingAgreements} to {@link TmaBillingAgreements}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link TmaBillingAgreements}
   */
  convert(
    source: Tmf.TmfBillingAgreements,
    target?: TmaBillingAgreements
  ): TmaBillingAgreements {
    if (target === undefined){
      target = { ...(source as any)};
    }

    return target;
  }
}
