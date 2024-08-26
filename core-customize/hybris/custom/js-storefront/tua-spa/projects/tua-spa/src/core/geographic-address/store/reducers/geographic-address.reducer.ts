// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { GeographicAddressAction, GeographicAddressActionTypes } from '../actions/geographic-address.actions';
import { GeographicAddress } from '../../../model';
import { GeographicAddressError } from '../../..';

export const selectedInstallationAddressInitialState: GeographicAddress = {};
export const errorInitialState: GeographicAddressError = {};

/**
 * Function to update the state with selected installation address
 *
 * @param state The state of the GeographicAddressState
 * @param action Dispatched action of {@link GeographicAddressAction}
 * @returns selected installation address as {@link GeographicAddress} of {@link GeographicAddressState}
 */
export function selectedInstallationAddressReducer(
  state = selectedInstallationAddressInitialState,
  action: GeographicAddressAction
): GeographicAddress {
  switch (action.type) {
    case GeographicAddressActionTypes.SELECTED_INSTALLATION_ADDRESS: {
      return action.payload.selectedInstallationAddress;
    }
    case GeographicAddressActionTypes.CLEAR_CREATED_GEOGRAPHIC_ADDRESS: {
      return selectedInstallationAddressInitialState;
    }
  }
  return state;
}

export function geographicAddressErrorReducer(
  state = errorInitialState,
  action: GeographicAddressAction
): GeographicAddressError {
  switch (action.type) {
    case GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS_FAIL:
        case GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS_FAIL: {
          return {
            geographicAddressError: action.payload.errorResponse,
            isGeographicAddressError: true,
          };
        }
    case GeographicAddressActionTypes.CLEAR_GEOGRAPHIC_ADDRESS_ERROR: {
      return errorInitialState;
    }
    case GeographicAddressActionTypes.SELECTED_INSTALLATION_ADDRESS: {
      state = {
        isGeographicAddressError: false,
      };
      return state;
    }
  }
  return state;
}
