// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved
import { Address, Converter } from '@spartacus/core';
import { Injectable } from '@angular/core';
import { GeographicAddress } from '../../../../model';

@Injectable({ providedIn: 'root' })
export class TmfGeographicAddressNormalizer implements Converter<GeographicAddress, Address> {
  convert(source: GeographicAddress, target: Address): Address {
    target = {
      id: source.id,
      firstName: source.firstName,
      lastName: source.lastName,
      line1: source.streetName,
      postalCode: source.postcode,
      town: source.city,
      district: '',
      country: {
        isocode: source.country,
        name: source?.countryName,
      },
      defaultAddress: false,
      shippingAddress: source.isShippingAddress,
      formattedAddress: source.streetName + ', ' + source.postcode + ', ' + source.city,
      visibleInAddressBook: true,
    }
    return target;
  }

}
