// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaCartModification } from '../../model/tma-cart.model';
import { Cart } from '@spartacus/cart/base/root';

export const TMA_CART_MODIFICATION_NORMALIZER = new InjectionToken<Converter<any, TmaCartModification>>('TmaCartModificationNormalizer');

export const TMA_CART_NORMALIZER = new InjectionToken<Converter<any, Cart>>(
    'TmaCartNormalizer'
  );
