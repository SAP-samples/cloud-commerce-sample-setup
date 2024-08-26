// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaTmfShoppingCart } from '../../model';
import { InjectionToken } from '@angular/core';
import { Converter, Images } from '@spartacus/core';

export const TMA_TMF_CART_NORMALIZER = new InjectionToken<Converter<any, TmaTmfShoppingCart>>('TmaTmfCartNormalizer');

