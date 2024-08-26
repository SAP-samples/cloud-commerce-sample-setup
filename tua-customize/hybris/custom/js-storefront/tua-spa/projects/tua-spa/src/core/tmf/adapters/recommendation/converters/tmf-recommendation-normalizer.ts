// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Recommendation } from '../../../../model';
import { Tmf } from '../../../tmf-models/tmf.models';

@Injectable({ providedIn: 'root' })
export class TmfRecommendationNormalizer
  implements Converter<Tmf.TmfRecommendation, Recommendation> {
  constructor() {
  }

  convert(
    source: Tmf.TmfRecommendation,
    target?: Recommendation
  ): Recommendation {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
