// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { TmaProduct } from '../../../model';

export abstract class ProductOfferingAdapter {
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
  abstract getProductOffering(
    baseSiteId: string,
    productOfferingId: string,
    processType?: string
  ): Observable<TmaProduct[]>;
}
