// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaConverter } from './tma-converter';
import { Injectable } from '@angular/core';
import { GeographicAddress, TmaPlace } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaGeographicAddressConverter extends TmaConverter<GeographicAddress, TmaPlace> {


  /**
   * Method responsible for converting a GeographicAddress to a TmaPlace
   *
   * @param source - a geographic address
   * @return a {@link TmaPlace}
   */
  convertSourceToTarget(source: GeographicAddress): TmaPlace {
    const place: TmaPlace = source ? {
      id: source.id,
      country: {
        isocode: source.country,
        name: source.countryName
      },
      town: source.city,
      postalCode: source.postcode,
      line1: source.streetName
    } : null;

    if (source.region && source.region.isocode) {
      place.region = source.region;
    }

    return place;
  }

  convertTargetToSource(target: TmaPlace): GeographicAddress {
    throw new Error('Method not implemented.');
  }
}
