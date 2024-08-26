// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum GeographicAddressActionTypes {
  CREATE_GEOGRAPHIC_ADDRESS = '[Geographic-Address] Create Geographic Address',
  CREATE_GEOGRAPHIC_ADDRESS_SUCCESS = '[Geographic-Address] Create Geographic Address Success',
  CREATE_GEOGRAPHIC_ADDRESS_FAIL = '[Geographic-Address] Create Geographic Address Fail',
  UPDATE_GEOGRAPHIC_ADDRESS = '[Geographic-Address] Update Geographic Address',
  UPDATE_GEOGRAPHIC_ADDRESS_SUCCESS = '[Geographic-Address] Update Geographic Address Success',
  UPDATE_GEOGRAPHIC_ADDRESS_FAIL = '[Geographic-Address] Update Geographic Address Fail',
  SELECTED_INSTALLATION_ADDRESS = '[Geographic-Address] Selected Installation Address',
  CLEAR_CREATED_GEOGRAPHIC_ADDRESS = '[Geographic-Address] Clear Created Geographic Address',
  CLEAR_GEOGRAPHIC_ADDRESS_ERROR = '[Geographic-Address] Clear Geographic Address Error',
}

export class CreateGeographicAddress implements Action {
  readonly type = GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS;
  constructor(public payload: any) {}
}

export class CreateGeographicAddressSuccess implements Action {
  readonly type =
    GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS_SUCCESS;
  constructor(public payload: any) {}
}

export class CreateGeographicAddressFail implements Action {
  readonly type = GeographicAddressActionTypes.CREATE_GEOGRAPHIC_ADDRESS_FAIL;
  constructor(public payload: any) {}
}

export class UpdateGeographicAddress implements Action {
  readonly type = GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS;
  constructor(public payload: any) {}
}

export class UpdateGeographicAddressSuccess implements Action {
  readonly type =
    GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdateGeographicAddressFail implements Action {
  readonly type = GeographicAddressActionTypes.UPDATE_GEOGRAPHIC_ADDRESS_FAIL;
  constructor(public payload: any) {}
}

export class SelectedInstallationAddress implements Action {
  readonly type = GeographicAddressActionTypes.SELECTED_INSTALLATION_ADDRESS;
  constructor(public payload: any) {}
}

export class ClearCreatedGeographicAddress implements Action {
  readonly type = GeographicAddressActionTypes.CLEAR_CREATED_GEOGRAPHIC_ADDRESS;
  constructor() {
  }
}

export class ClearGeographicAddressError implements Action {
  readonly type = GeographicAddressActionTypes.CLEAR_GEOGRAPHIC_ADDRESS_ERROR;
  constructor() {
  }
}

export type GeographicAddressAction =
  | CreateGeographicAddress
  | CreateGeographicAddressSuccess
  | CreateGeographicAddressFail
  | UpdateGeographicAddress
  | UpdateGeographicAddressSuccess
  | UpdateGeographicAddressFail
  | SelectedInstallationAddress
  | ClearCreatedGeographicAddress
  | ClearGeographicAddressError;
