// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaActionType, TmaTmfProductOffering } from '.';

export interface TmaChecklistAction {
  id?: string;
  name?: string;
  actionType: string;
  productOffering?: TmaTmfProductOffering[];
}

export enum TmaChecklistActionType {
  CONTRACT_START_DATE = 'CONTRACT_START_DATE',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  INSTALLATION_ADDRESS = 'INSTALLATION_ADDRESS',
  APPOINTMENT = 'APPOINTMENT',
  MSISDN = 'MSISDN',
  ESTIMATED_CONSUMPTION = 'ESTIMATED_CONSUMPTION',
  RELIES_ON = 'RELIES_ON'
}

export interface TmaCheckListActionDetails {
  type: TmaChecklistActionType;
  value?: any;
  action?: TmaActionType
}
