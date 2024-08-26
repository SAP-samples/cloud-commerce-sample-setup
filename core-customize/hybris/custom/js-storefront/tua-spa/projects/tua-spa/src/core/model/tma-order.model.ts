// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaCartPrice, TmaOrderEntry } from './tma-cart.entry.model';
import { TmaProcessType } from './tma-common.model';
import { Order } from '@spartacus/order/root';

export interface TmaOrder extends Order {
  entries?: TmaOrderEntry[];
  unconsignedEntries?: TmaOrderEntry[];
  orderCosts?: TmaCartPrice[];
  processType?: TmaProcessType;
  contractStartDate?: string;
}

