// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter, Product } from '@spartacus/core';

export const TMA_PRODUCT_NORMALIZER = new InjectionToken<
  Converter<any, Product>
>('TmaProductNormalizer');
