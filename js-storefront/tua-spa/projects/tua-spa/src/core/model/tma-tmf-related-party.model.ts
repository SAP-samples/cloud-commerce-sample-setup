// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export interface TmaTmfRelatedParty {
  id: string;
  href?: string;
  role?: string;
  name?: string;
}

export enum TmaTmfRelatedPartyRole {
  CUSTOMER = 'CUSTOMER',
}
