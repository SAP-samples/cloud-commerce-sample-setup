// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaOrderEntry } from '../../model';
import { CartEvent } from '@spartacus/cart/base/root';

export class TmaCartAddEntryEvent implements CartEvent {
  cartId: string;
  userId: string;
  cartCode: string;
  cartEntry: TmaOrderEntry;
}
