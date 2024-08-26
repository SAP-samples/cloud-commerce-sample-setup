// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as TmfProductSelectors from '../store/selectors';
import { tap } from 'rxjs/operators';
import { TmaStateWithTmfProduct, TmfProductMap } from '../store';
import * as TmfProductActions from '../store/actions/tmf-product.action';
import { BaseSiteService } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
})
export class TmfProductService implements OnDestroy {
  protected baseSiteId: string;
  protected subscription = new Subscription();

  constructor(
    protected store: Store<TmaStateWithTmfProduct>,
    protected baseSiteService: BaseSiteService
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns a TmfProduct details
   * @param tmfProductId The identifier of the TmfProduct
   * @returns TmfProduct details {@link TmfProduct} as an {@link Observable}
   */
  getTmfProductDetails(tmfProductId: string): Observable<TmfProductMap> {
    return this.store.pipe(
      select(TmfProductSelectors.getTmfProduct, {
        baseSiteId: this.baseSiteId,
        tmfProductId: tmfProductId,
      }),
      tap((product: TmfProductMap) => {
        if (product == null) {
          this.loadTmfProductDetails(this.baseSiteId, tmfProductId);
        }
      })
    );
  }

  /**
   * Loads the TmfProduct details.
   *
   * @param baseSiteId The identifier of the base site
   * @param tmfProductId The identifier of the TmfProduct
   */
  loadTmfProductDetails(baseSiteId: string, tmfProductId: string): void {
    this.store.dispatch(
      new TmfProductActions.LoadTmfProduct({
        baseSiteId,
        tmfProductId,
      })
    );
  }

  /**
   * Clears the TmfProduct details.
   */
  clearTmfProductDetails(): void {
    this.store.dispatch(new TmfProductActions.ClearTmfProduct());
  }

 /**
  * Retrives the TmfProductMap for given product id.
  *
  * @param tmfProductId The identifier of the TmfProduct
  * @returns TmfProductMap details {@link TmfProductMap} as an {@link Observable}
  */
  getTmfProductMap(tmfProductId: string): Observable<TmfProductMap> {
    return this.store.pipe(
      select(TmfProductSelectors.getTmfProductMap, {
        baseSiteId: this.baseSiteId,
        tmfProductId: tmfProductId
      }),
      tap((product: TmfProductMap) => {
        if (product == null) {
          this.loadTmfProductDetails(this.baseSiteId, tmfProductId);
        }
      })
    );
  }
}
