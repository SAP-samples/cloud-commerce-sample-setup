// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { TmaProduct, TmaProductOfferingPrice } from '../../model';

export const PRODUCT_OFFERING_NORMALIZER = new InjectionToken<
  Converter<any, TmaProduct>
>('ProductOfferingNormalizer');

export const PRODUCT_OFFERING_PRICE_NORMALIZER = new InjectionToken<
  Converter<any, TmaProductOfferingPrice[]>
>('ProductOfferingPriceNormalizer');
