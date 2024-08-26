// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter, ProductSearchPage } from '@spartacus/core';

export const TMA_PRODUCT_SEARCH_PAGE_NORMALIZER = new InjectionToken<
  Converter<any, ProductSearchPage>
>('TmaProductSearchPageNormalizer');
