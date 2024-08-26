// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { GeographicAddress } from '../../model';

export const GEOGRAPHIC_ADDRESS_FEATURE = 'Geographic Address';

export interface StateWithGeographicAddress {
  [GEOGRAPHIC_ADDRESS_FEATURE]: GeographicAddressState;
}

export interface GeographicAddressState {
  installationAddress: GeographicAddress;
  error?: GeographicAddressError;
}

export interface GeographicAddressError {
  geographicAddressId?: string;
  geographicAddressError?: string;
  isGeographicAddressError?: boolean;
}
