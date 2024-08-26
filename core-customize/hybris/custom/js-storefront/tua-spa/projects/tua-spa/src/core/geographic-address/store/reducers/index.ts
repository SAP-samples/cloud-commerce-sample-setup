// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import { geographicAddressErrorReducer, selectedInstallationAddressReducer } from './geographic-address.reducer';
import { GeographicAddressState } from '../geographic-address-state';
import { AuthActions } from '@spartacus/core';

export function getReducers(): ActionReducerMap<GeographicAddressState> {
  return {
    installationAddress: selectedInstallationAddressReducer,
    error: geographicAddressErrorReducer,
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  GeographicAddressState
>> = new InjectionToken<ActionReducerMap<GeographicAddressState>>(
  'GeographicAddressReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};

export function clearSessionStorageInstallationAddress(
  reducer: ActionReducer<any>,
): ActionReducer<any> {
  return function (state, action) {
    if (action.type === AuthActions.LOGOUT) {
      sessionStorage.removeItem("Address");
      sessionStorage.removeItem("Country");
    }
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<any>[] = [clearSessionStorageInstallationAddress];

