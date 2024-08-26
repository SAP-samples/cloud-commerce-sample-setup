// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Country, Region } from '@spartacus/core';

export class TmaInstallationAddress {
  buildingNumber: string;
  streetName: string;
  apartmentNumber?: string;
  city: string;
  country: Country;
  region?: Region;
  postalCode: string;

  static equals(i1: TmaInstallationAddress, i2: TmaInstallationAddress): boolean {
    return i1.buildingNumber === i2.buildingNumber &&
      i1.streetName === i2.streetName &&
      i1.apartmentNumber === i2.apartmentNumber &&
      i1.city === i2.city &&
      i1.country.isocode === i2.country.isocode &&
      i1.country.name === i2.country.name &&
      (i1.region && i2.region ?
        i1.region.isocode === i2.region.isocode &&
        i1.region.name === i2.region.name : (!i1.region && !i2.region)) &&
      i1.postalCode === i2.postalCode;
  }
}

export class TmaTechnicalDetails {
  id: string;
  type?: string;

  static equals(m1: TmaTechnicalDetails, m2: TmaTechnicalDetails): boolean {
    return m1.id === m2.id &&
      m1.type === m2.type;
  }
}

export interface TmaTechnicalResources {
  technicalResources?: TmaTechnicalResource[];
  error?: TmaErrorResponse;
}

export interface TmaTechnicalResource {
  id?: string;
  type?: TmaTechnicalResourceType;
}

export interface TmaErrorResponse {
  status: string;
  message: string;
}

export enum TmaTechnicalResourceType {
  DIVISION = 'DIVISION',
  INSTALLATION = 'INSTALLATION'
}

export class TmaPremiseDetail {
  installationAddress: TmaInstallationAddress;
  technicalDetails: TmaTechnicalDetails;

  static equals(p1: TmaPremiseDetail, p2: TmaPremiseDetail): boolean {
    return TmaInstallationAddress.equals(p1.installationAddress, p2.installationAddress) && TmaTechnicalDetails.equals(p1.technicalDetails, p2.technicalDetails);
  }
}
