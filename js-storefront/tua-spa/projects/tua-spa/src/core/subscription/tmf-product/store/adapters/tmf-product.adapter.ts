// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { TmfProduct } from '../../../../model';

export abstract class TmfProductAdapter {
  /**
   * Abstract method used to get the tmf product details
   * @param baseSiteId The identifier of the base site
   * @param tmfProductId The identifier of the tmf product
   * @returns Observable of TmfProduct
   */
  abstract getTmfProductDetails(
    baseSiteId: string,
    tmfProductId: string
  ): Observable<TmfProduct>;
}
