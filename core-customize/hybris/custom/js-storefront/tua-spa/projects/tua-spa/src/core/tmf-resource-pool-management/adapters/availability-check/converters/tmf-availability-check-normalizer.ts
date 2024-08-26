// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { AppliedCapacityAmount } from '../../../../model';
import { TmfLogicalResource } from '../../../tmf-resource-pool-management-models';

@Injectable({ providedIn: 'root' })
export class TmfAvailabilityCheckNormalizer
  implements Converter<TmfLogicalResource.TmfAppliedCapacityAmount, AppliedCapacityAmount> {
  constructor() {
  }

  convert(
    source: TmfLogicalResource.TmfAppliedCapacityAmount,
    target?: AppliedCapacityAmount
  ): AppliedCapacityAmount {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
