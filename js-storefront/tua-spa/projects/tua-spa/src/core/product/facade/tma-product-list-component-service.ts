// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivatedRouterStateSnapshot,
  CmsService,
  ContentSlotComponentData,
  CurrencyService,
  LanguageService,
  Page,
  ProductSearchPage,
  RoutingService,
  SearchConfig
} from '@spartacus/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, pluck, shareReplay, take, tap } from 'rxjs/operators';
import { ProductListComponentService, ViewConfig } from '@spartacus/storefront';
import { TmaProductSearchService } from './tma-product-search.service';
import { QueryServiceQualificationService } from '../../queryServiceQualification';
import { GeographicAddress, QueryServiceQualification } from '../../model';

interface ProductListRouteParams {
  brandCode?: string;
  categoryCode?: string;
  query?: string;
}

interface SearchCriteria {
  currentPage?: number;
  pageSize?: number;
  sortCode?: string;
  query?: string;
}

@Injectable({ providedIn: 'root' })
export class TmaProductListComponentService extends ProductListComponentService implements OnDestroy {
  routeParam: ProductListRouteParams;
  page$: Observable<Page>;
  page: Page;

  protected subscription = new Subscription();

  protected readonly RELEVANCE_ALLCATEGORIES = ':relevance:allCategories:';

  constructor(
    protected tmaProductSearchService: TmaProductSearchService,
    protected routing: RoutingService,
    protected activatedRoute: ActivatedRoute,
    protected currencyService: CurrencyService,
    protected languageService: LanguageService,
    protected router: Router,
    protected config: ViewConfig,
    protected cmsService?: CmsService,
    protected queryServiceQualificationService?: QueryServiceQualificationService
  ) {
    super(
      tmaProductSearchService,
      routing,
      activatedRoute,
      currencyService,
      languageService,
      router,
      config
    );
    this.page$ = this.cmsService.getCurrentPage();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private tmaSearchResults$: Observable<
    ProductSearchPage
  > = this.tmaProductSearchService
    .getResults()
    .pipe(filter(searchResult => Object.keys(searchResult).length > 0));

  private tmaSearchByRouting$: Observable<
    ActivatedRouterStateSnapshot
  > = combineLatest([
    this.routing.getRouterState().pipe(
      distinctUntilChanged((x, y) => {
        return x.state.url === y.state.url;
      })
    ),
    this.languageService.getActive(),
    this.currencyService.getActive()
  ]).pipe(
    pluck(0, 'state'),
    tap((state: ActivatedRouterStateSnapshot) => {
      const criteria = this.getTmaCriteriaFromRoute(
        state.params,
        state.queryParams
      );
      this.searchBy(criteria);
    })
  );

  /**
   * This stream should be used only on the Product Listing Page.
   *
   * It not only emits search results, but also performs a search on every change
   * of the route (i.e. route params or query params).
   *
   * When a user leaves the PLP route, the PLP component unsubscribes from this stream
   * so no longer the search is performed on route change.
   */
  readonly model$: Observable<ProductSearchPage> = combineLatest([
    this.tmaSearchResults$,
    this.tmaSearchByRouting$
  ]).pipe(
    pluck(0),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  /**
   * Perfoms product search based on query,searchConfig from route criteria
   */
  getProductSearch(): void {
    let criteria;
    this.routing
      .getRouterState()
      .subscribe(route => {
        this.routeParam = route.state.params;
        const routeCriteria = this.getTmaCriteriaFromRoute(
          route.state.params,
          route.state.queryParams
        );
        criteria = {
          ...routeCriteria
        };
      })
      .unsubscribe();
    const searchConfig = this.getSearchConfig(criteria);
    const query = this.getTmaQueryFromRouteParams(this.routeParam);
    this.setQuery(query);
    const finalQuery: string[] = [];
    this.performProductSearch(query, finalQuery, searchConfig);
  }

  /**
   * Get items from a given page without using navigation
   *
   * @param pageNumber of {@link number}
   */
  getPageItems(pageNumber: number): void {
    this.routing
      .getRouterState()
      .subscribe(route => {
        const routeCriteria = this.getTmaCriteriaFromRoute(
          route.state.params,
          route.state.queryParams
        );
        const criteria = {
          ...routeCriteria,
          currentPage: pageNumber
        };
        this.searchBy(criteria);
      })
      .unsubscribe();
  }

  /**
   * Sets the query in query params
   *
   * @param query of {@link string}
   */
  setQuery(query: string): void {
    this.setQueryParams({ query, currentPage: undefined });
  }

  protected getInputAddress(): GeographicAddress | null {
    const address: GeographicAddress = {};
    if (sessionStorage.getItem('Address')) {
      const addressLocal: any = JSON.parse(sessionStorage.getItem('Address'));
      address.isShippingAddress = false;
      address.isInstallationAddress = true;
      address.streetName = addressLocal.streetName.split(',')[1];
      address.streetNr = addressLocal.streetNr;
      address.postcode = addressLocal.postcode;
      address.city = addressLocal.city;
      address.country = sessionStorage.getItem('Country');
      return address;
    }
    return null;
  }

protected serviceablilityCheckRequired(): boolean {
  let serviceabilityComponent = false;
  this.subscription.add(
    this.page$
      .pipe(
        take(1),
        filter((res: Page) => !!res)
      )
      .subscribe(res => {
        this.page = res;
        let serviceabilityButtonComponent: ContentSlotComponentData | undefined;
        Object.keys(this.page.slots).forEach((key: string) => {
          if (
            this.page.slots[key] &&
            this.page.slots[key].components &&
            serviceabilityButtonComponent === undefined
          ) {
            serviceabilityButtonComponent = this.page.slots[
              key
            ].components.find(
              (component: ContentSlotComponentData) =>
                component.uid === 'ServiceabilityButtonComponent'
            );
          }
        });
        if (serviceabilityButtonComponent) {
          serviceabilityComponent = true;
        }
      })
  );
  return serviceabilityComponent;
}

  private getTmaCriteriaFromRoute(
    routeParams: ProductListRouteParams,
    queryParams: SearchCriteria
  ): SearchCriteria {
    return {
      query: queryParams.query || this.getTmaQueryFromRouteParams(routeParams),
      pageSize: queryParams.pageSize || this.config.view?.defaultPageSize,
      currentPage: queryParams.currentPage,
      sortCode: queryParams.sortCode
    };
  }

  private getTmaQueryFromRouteParams({
    brandCode,
    categoryCode,
    query
  }: ProductListRouteParams) {
    if (query) {
      return query;
    }
    if (categoryCode) {
      return this.RELEVANCE_ALLCATEGORIES + categoryCode;
    }
    if (brandCode) {
      return this.RELEVANCE_ALLCATEGORIES + brandCode;
    }
    return undefined;
  }

  private searchBy(criteria: SearchCriteria): void {
    const query = criteria.query;
    const searchConfig = this.getSearchConfig(criteria);
    const queries: string[] = [query];
    this.performProductSearch(query, queries, searchConfig);
  }

  private performProductSearch(
    query: string,
    queries: string[],
    searchConfig: SearchConfig
  ) {
    if (this.serviceablilityCheckRequired()) {
      queries = [];
      let searchQueries: string[];
      if (this.getInputAddress()) {
        this.subscription.add(
          this.queryServiceQualificationService
            .getQueryServiceQualification(this.getInputAddress())
            .pipe(
              take(2),
              filter((res: QueryServiceQualification) => !!res)
            )
            .subscribe((res: QueryServiceQualification) => {
              searchQueries = this.queryServiceQualificationService.createQueriesForServiceQualification(
                res
              );
              if (searchQueries && searchQueries.length > 0) {
                searchQueries.forEach(serviceQualificationQuery => {
                  let newQuery = query;
                  newQuery = newQuery.concat(
                    serviceQualificationQuery.replace('*::', ':')
                  );
                  queries.push(newQuery);
                });
              }
              this.tmaProductSearchService.searchProduct(
                queries,
                searchConfig,
                this.serviceablilityCheckRequired()
              );
            })
        );
      }
    } else {
      this.tmaProductSearchService.searchProduct(
        queries,
        searchConfig,
        this.serviceablilityCheckRequired()
      );
    }
  }

  private getSearchConfig(criteria: SearchCriteria): SearchConfig {
    const result: SearchConfig = {
      currentPage: criteria.currentPage,
      pageSize: criteria.pageSize,
      sort: criteria.sortCode
    };
    Object.keys(result).forEach(key => !result[key] && delete result[key]);
    return result;
  }

  private setQueryParams(queryParams: SearchCriteria): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    });
  }
}
