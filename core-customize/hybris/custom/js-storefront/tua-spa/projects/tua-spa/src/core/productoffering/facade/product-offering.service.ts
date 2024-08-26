// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TmaProduct } from '../../model';
import { ProductOfferingActions } from '../store';
import { StateWithProductOffering } from '../store/product-offering-state';
import * as ProductOfferingSelectors from '../store/selectors/product-offering.selector';

@Injectable()
export class ProductOfferingService {
  selectedProductOfferings$ = new BehaviorSubject<any>([]);

  constructor(protected store: Store<StateWithProductOffering>) {}

  /**
   * Retrieves the details for the given product offering with context as specified.
   * For example, if processType is given then the product offering details will contain
   * priceContext and productOfferingPrice specific to process type.
   *
   * @param baseSiteId
   *         The identifier of the base site as {@link string}
   * @param ProductOfferingId
   *          The identifier of the productOffering as {@link string}
   * @param processType
   *         The identifier of the processType as {@link string}
   * @return
   *         The product offering details as {@link Observable} of {@link TmaProduct}
   */
  getProductOffering(
    baseSiteId: string,
    productOfferingId: string,
    processType?: string
  ): Observable<TmaProduct> {
    return this.store.pipe(
      select(ProductOfferingSelectors.getProductOffering, {
        processType,
        productOfferingId
      }),
      tap((productOffering: TmaProduct) => {
        if (productOffering === undefined) {
          this.store.dispatch(
            new ProductOfferingActions.LoadProductOffering({
              baseSiteId: baseSiteId,
              productOfferingId: productOfferingId,
              processType: processType
            })
          );
        }
      })
    );
  }

  /**
   * Clears the state of product offering.
   */
  clearProductOfferingState(): void {
    this.store.dispatch(new ProductOfferingActions.ClearProductOfferingState());
  }
}
