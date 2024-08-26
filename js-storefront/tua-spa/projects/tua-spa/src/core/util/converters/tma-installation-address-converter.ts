// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaConverter } from './tma-converter';
import { Address } from '@spartacus/core';
import { Injectable } from '@angular/core';
import { TmaInstallationAddress } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class TmaInstallationAddressConverter extends TmaConverter<TmaInstallationAddress, Address> {

  /**
   * Method for converting an installation address to an address
   *
   * @param source - an installation address
   * @return an {@link Address}
   */
  convertSourceToTarget(source: TmaInstallationAddress): Address {
    const address: Address = source ? {
      country: source.country,
      line1: source.streetName + ',' + source.buildingNumber,
      line2: source.apartmentNumber,
      postalCode: source.postalCode,
      town: source.city
    } : null;

    if (source.region && source.region.isocode) {
      address.region = source.region;
    }

    return address;
  }

  /**
   * Method for converting an address to an installation address
   *
   * @param target - an address
   * @return a {@link TmaInstallationAddress}
   */
  convertTargetToSource(target: Address): TmaInstallationAddress {
    return target ? {
      country: {
        isocode: target.country.isocode,
        name: target.country.name
      },
      buildingNumber: target.line1 ? target.line1.split(',', target.line1.length).pop() : '',
      streetName: target.line1 ? target.line1.replace(',' + target.line1.split(',', target.line1.length).pop(), '') : '',
      apartmentNumber: target.line2,
      postalCode: target.postalCode,
      region: {
        isocode: target.region ? target.region.isocode : null,
        name: target.region ? target.region.name : null
      },
      city: target.town
    } : null;
  }
}
