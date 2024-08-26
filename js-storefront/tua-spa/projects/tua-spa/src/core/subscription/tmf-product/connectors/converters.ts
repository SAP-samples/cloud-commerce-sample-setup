// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmfProduct } from '../../../model';

export const TMF_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<any, TmfProduct>
>('TmfProductNormalizer');
