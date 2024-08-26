// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Address } from '@spartacus/core';

export interface TmaAddress extends Address {
  installationAddress?: boolean;
}
