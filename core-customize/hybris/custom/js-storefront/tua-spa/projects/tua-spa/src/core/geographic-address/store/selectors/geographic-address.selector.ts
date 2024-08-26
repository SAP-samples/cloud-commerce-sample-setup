// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { GEOGRAPHIC_ADDRESS_FEATURE, GeographicAddressState, StateWithGeographicAddress } from '../geographic-address-state';
import { GeographicAddress } from '../../../model';

export const getGeographicAddressFeatureState: MemoizedSelector<
  StateWithGeographicAddress,
  GeographicAddressState
> = createFeatureSelector<GeographicAddressState>(GEOGRAPHIC_ADDRESS_FEATURE);

export const getSelectedInstallationGeographicAddress: MemoizedSelector<
  StateWithGeographicAddress,
  GeographicAddress
> = createSelector(
  getGeographicAddressFeatureState,
  (state: GeographicAddressState) => { return state.installationAddress;
  }
);

export const getSelectedGeographicAddressError: MemoizedSelector<
  StateWithGeographicAddress,
  boolean
> = createSelector(
  getGeographicAddressFeatureState,
  (state: GeographicAddressState) => state.error.isGeographicAddressError
);
