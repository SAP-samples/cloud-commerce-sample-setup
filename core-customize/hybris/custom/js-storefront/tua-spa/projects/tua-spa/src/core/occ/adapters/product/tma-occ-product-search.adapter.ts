// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ConverterService,
  OccEndpointsService,
  OccProductSearchAdapter,
  ProductSearchAdapter,
  ProductSearchPage,
  SearchConfig
} from '@spartacus/core';
import { Injectable } from '@angular/core';
import { TMA_PRODUCT_SEARCH_PAGE_NORMALIZER } from '../../../product';

const DEFAULT_SEARCH_CONFIG: SearchConfig = {
  pageSize: 20
};

@Injectable()
export class TmaOccProductSearchAdapter extends OccProductSearchAdapter
  implements ProductSearchAdapter {
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
    super(http, occEndpoints, converter);
  }

/**
 * Performs product search based on given query and searchConfig
 *
 * @param  query of {@link string}
 * @param  searchConfig [searchConfig=DEFAULT_SEARCH_CONFIG]
 * @returns of {Observable<ProductSearchPage>}
 */
search(
    query: string,
    searchConfig: SearchConfig = DEFAULT_SEARCH_CONFIG
  ): Observable<ProductSearchPage> {
    return this.http
      .get(this.getSearchEndpoint(query, searchConfig))
      .pipe(this.converter.pipeable(TMA_PRODUCT_SEARCH_PAGE_NORMALIZER));
  }
}
