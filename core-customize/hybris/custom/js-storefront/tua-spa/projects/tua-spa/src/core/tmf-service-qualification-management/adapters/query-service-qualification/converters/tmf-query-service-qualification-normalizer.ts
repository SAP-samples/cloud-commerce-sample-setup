// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmfQueryServiceQualificationApiModel } from '../../../tmf-query-service-qualification-models';
import { QueryServiceQualification } from '../../../../model';

@Injectable({
  providedIn: 'root'
})
export class TmfQueryServiceQualificationNormalizer
  implements Converter<TmfQueryServiceQualificationApiModel.TmfQueryServiceQualification,QueryServiceQualification> {
  constructor() {
  }

  convert(
    source: TmfQueryServiceQualificationApiModel.TmfQueryServiceQualification,
    target?: QueryServiceQualification
  ): QueryServiceQualification {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
