// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Converter } from '@spartacus/core';
import { GeographicAddress } from '../../../../model';
import { Tmf } from '../../../tmf-models';

@Injectable({ providedIn: 'root' })
export class TmfGeographicAddressNormalizer
  implements Converter<Tmf.TmfGeographicAddress, GeographicAddress> {
  constructor() {
  }

  /**
   * Converts {@link Tmf.TmfGeographicAddress} to {@link GeographicAddress}.
   *
   * @param source - The object which will be used to retrieve the values from
   * @param target - The object which will be populated with the values from the source
   * @return target object of {@link GeographicAddress}
   */
  convert(
    source: Tmf.TmfGeographicAddress,
    target?: GeographicAddress
  ): GeographicAddress {
    if (target === undefined) {
      target = { ...(source as any) };
    }

    return target;
  }
}
