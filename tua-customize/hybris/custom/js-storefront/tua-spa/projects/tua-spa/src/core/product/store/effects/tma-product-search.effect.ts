// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import {
  Breadcrumb,
  Facet,
  FacetValue,
  PaginationModel,
  Product,
  ProductActions,
  ProductSearchConnector,
  ProductSearchPage,
  SearchState,
  SortModel
} from '@spartacus/core';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaProductSearchAction } from '../actions';

@Injectable()
export class TmaProductsSearchEffects {
  constructor(
    private actions$: Actions,
    private productSearchConnector: ProductSearchConnector
  ) {}

  tmaSearchProducts$: Observable<
    ProductActions.SearchProductsSuccess | ProductActions.SearchProductsFail
  > = createEffect(() => this.actions$.pipe(
    ofType(TmaProductSearchAction.TMA_SEARCH_PRODUCTS),
    map((action: TmaProductSearchAction.TmaSearchProducts) => action.payload),
    concatMap(payload => {
      const queryResult = [];
      payload.queryText.forEach((query: string) => {
        queryResult.push(
          this.productSearchConnector.search(query, payload.searchConfig)
        );
      });
      return forkJoin(...queryResult).pipe(
        map((data: ProductSearchPage[]) => {
          let productSearchPage: ProductSearchPage;
          let paginationModel: PaginationModel;
          const sortModels: SortModel[] = data.map(result => result.sorts).reduce((acc, el) => [...acc, ...el], []);
          const facets: Facet[] = data.map(result => result.facets).reduce((acc, el) => [...acc, ...el], []);
          const products: Product[] = data.map(result => result.products).reduce((acc, el) => [...acc, ...el], []);
          const breadcrumbs: Breadcrumb[] = data.map(result => result.breadcrumbs).reduce((acc, el) => [...acc, ...el], []);
          let searchState: SearchState;
          if (data && data.length > 0) {
            paginationModel = this.getPaginationModel(products, payload);
            data.map(result => {
              searchState = result.currentQuery;
            }),
              (productSearchPage = {
                products: products.filter(
                  (n, i) => products.findIndex(v => v.code === n.code) === i
                ),
                breadcrumbs: breadcrumbs.filter(
                  (n, i) =>
                    breadcrumbs.findIndex(
                      v =>
                        v.facetCode === n.facetCode &&
                        v.facetValueCode === n.facetValueCode
                    ) === i
                ),
                facets: this.getFacet(facets),
                sorts: sortModels.filter(
                  (n, i) => sortModels.findIndex(v => v.code === n.code) === i
                ),
                pagination: paginationModel,
                currentQuery: searchState
              });
            return new ProductActions.SearchProductsSuccess(productSearchPage);
          }
          return undefined;
        }),
        catchError(error =>
          of(
            new ProductActions.SearchProductsFail(makeErrorSerializable(error))
          )
        )
      );
    })
  )
  );

  private getPaginationModel(products: Product[], payload): PaginationModel {
    let totalPages = Math.floor(
      products.length / payload.searchConfig.pageSize
    );
    if (products.length % payload.searchConfig.pageSize > 0) {
      totalPages = totalPages + 1;
    }
    const paginationModel: PaginationModel = {
      pageSize: payload.searchConfig.pageSize,
      sort: payload.searchConfig.sort ? payload.searchConfig.sort : 'relevance',
      totalResults: products.length,
      totalPages: totalPages
    };
    return paginationModel;
  }

  private getFacet(facets): Facet[] {
    const uniqueFacets: Facet[] = [];
    facets.forEach(facet => {
      if (uniqueFacets.length > 0) {
        const eligibleFacet: Facet = uniqueFacets.find(
          uniqueFacet => uniqueFacet.name === facet.name
        );
        if (eligibleFacet) {
          facet.values.forEach((facetValue: FacetValue) => {
            eligibleFacet.values.push(facetValue);
          });
          const uniqueFacetValues = eligibleFacet.values.filter(
            (n, i) =>
              eligibleFacet.values.findIndex(v => v.name === n.name) === i
          );
          eligibleFacet.values = uniqueFacetValues;
        } else {
          uniqueFacets.push(facet);
        }
      } else {
        uniqueFacets.push(facet);
      }
    });
    return uniqueFacets;
  }
}
