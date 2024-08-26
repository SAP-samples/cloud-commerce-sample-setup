// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { EventEmitter, Injectable, OnDestroy, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ProductActions, ProductSearchService, SearchConfig, StateWithProduct, User } from '@spartacus/core';
import { first } from 'rxjs/operators';
import * as TmaProductSearchAction from '../store/actions/tma-product-search.action';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Injectable({
  providedIn: 'root'
})
export class TmaProductSearchService extends ProductSearchService implements OnDestroy {
  addToCart: boolean = false;

  @Output()
  submitEvent = new EventEmitter<any>();

  protected currentUser: User;
  protected subscription = new Subscription();

  constructor(
    protected store: Store<StateWithProduct>,
    protected userAccountFacade?: UserAccountFacade
  ) {
    super(store);
    this.subscription.add(
    this.userAccountFacade
      .get()
      .pipe(
        first((user: User) => user != null)
      )
      .subscribe((user: User) => (this.currentUser = user))
    );
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Performs a product search. In case if serviceability button component is present
   * then custom product search is perfomed and filter out the serviceable product at the given input address
   *
   * @param query as {@link string}
   * @param searchConfig as {@link SearchConfig}
   */
  searchProduct(
    queries: string[],
    searchConfig?: SearchConfig,
    serviceableComponent: boolean = false
  ): void {
    if (serviceableComponent) {
      this.store.dispatch(
        new TmaProductSearchAction.TmaSearchProducts({
          queryText: queries,
          searchConfig: searchConfig
        })
      );
      this.addToCart = true;
    } else {
      this.addToCart = false;
      this.store.dispatch(
        new ProductActions.SearchProducts({
          queryText: queries[0],
          searchConfig: searchConfig
        })
      );
    }
  }

  /**
   * If the product is serviceable then return true (show add to cart button instead
   * of see details button)
   *
   * @returns of {@link Boolean}
   */
  addToCartServiceableProduct(): boolean {
    return this.addToCart;
  }
}
