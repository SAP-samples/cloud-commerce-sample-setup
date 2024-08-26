// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfRelatedParty } from './tma-tmf-related-party.model';
import { Region } from '@spartacus/core';

export interface GeographicAddress {
  id?: string;
  href?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  streetNr?: string;
  streetNrLast?: string;
  streetNrLastSuffix?: string;
  streetName?: string;
  streetType?: string;
  streetSuffix?: string;
  postcode?: string;
  locality?: string;
  city?: string;
  stateOfProvince?: string;
  country?: string;
  countryName?: string;
  relatedParty?: TmaTmfRelatedParty[];
  geographicSubAddress?: GeographicSubAddress;
  isInstallationAddress?: boolean;
  isUnloadingAddress?: boolean;
  isContactAddress?: boolean;
  isShippingAddress?: boolean;
  isBillingAddress?: boolean;
  '@type'?: string;
  region?: Region;
}

export interface GeographicSubAddress {
  id?: string;
  href?: string;
  name?: string;
  type?: string;
  subUnitType?: string;
  subUnitNumber?: string;
  levelType?: string;
  levelNumber?: string;
  buildingName?: string;
  privateStreetNumber?: string;
  privateStreetName?: string;
}
