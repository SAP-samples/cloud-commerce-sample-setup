// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaTechnicalResource } from '../../../../model';
import { PremiseLookup } from '../../../models';


@Injectable({ providedIn: 'root' })
export class TmaPremiseLookupPremiseDetailNormalizer implements Converter<PremiseLookup.TmaPremiseLookupTechnicalResource, TmaTechnicalResource> {
  constructor() {
  }

  convert(source: PremiseLookup.TmaPremiseLookupTechnicalResource, target?: TmaTechnicalResource): TmaTechnicalResource {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
