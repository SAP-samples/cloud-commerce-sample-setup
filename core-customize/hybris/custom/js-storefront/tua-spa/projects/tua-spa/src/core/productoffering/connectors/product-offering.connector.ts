// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TmaProduct } from '../../model';
import { ProductOfferingAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root'
})
export class ProductOfferingConnector {
  constructor(protected adapter: ProductOfferingAdapter) {}

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
  public getProductOffering(
    baseSiteId: string,
    productOfferingId: string,
    processType?: string
  ): Observable<TmaProduct[]> {
    return this.adapter.getProductOffering(
      baseSiteId,
      productOfferingId,
      processType
    );
  }
}
