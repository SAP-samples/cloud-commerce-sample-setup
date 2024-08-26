// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { Order } from '@spartacus/order/root';

export const TMA_ORDER_NORMALIZER = new InjectionToken<Converter<any, Order>>(
  'TmaOrderNormalizer'
);
