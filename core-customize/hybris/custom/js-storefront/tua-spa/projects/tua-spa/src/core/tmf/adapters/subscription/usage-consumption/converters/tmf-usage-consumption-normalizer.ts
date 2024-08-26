// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Tmf } from '../../../../tmf-models';
import { UsageConsumptionReport } from '../../../../../model';

@Injectable({ providedIn: 'root' })
export class TmfUsageConsumptionNormalizer
  implements Converter<Tmf.TmfUsageConsumptionReport, UsageConsumptionReport> {
  constructor() {
  }

  convert(
    source: Tmf.TmfUsageConsumptionReport,
    target?: UsageConsumptionReport
  ): UsageConsumptionReport {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
