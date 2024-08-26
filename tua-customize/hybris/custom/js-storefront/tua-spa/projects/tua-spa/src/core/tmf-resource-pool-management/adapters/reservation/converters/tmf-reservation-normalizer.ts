// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Reservation } from '../../../../model';
import { TmfLogicalResource } from '../../../tmf-resource-pool-management-models';

@Injectable({ providedIn: 'root' })
export class TmfReservationNormalizer
  implements Converter<TmfLogicalResource.TmfReservation, Reservation> {
  constructor() {
  }

  convert(
    source: TmfLogicalResource.TmfReservation,
    target?: Reservation
  ): Reservation {
    if (target === undefined) {
      target = { ...(source as any) };
    }
    return target;
  }
}
