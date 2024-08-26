// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaChecklistAction, TmaProcessTypeEnum } from '../../model';
import { Injectable } from '@angular/core';
import { TmaChecklistActionAdapter } from '../store/adapters';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmaChecklistActionConnector {
  constructor(protected adapter: TmaChecklistActionAdapter) {}

  /**
   * Retrives the checklist actions for single product offering
   *
   * @param baseSiteId The identifier of the base site
   * @param productCode The identifier of the product offering
   * @param  processType The identifier of the processType
   * @return The TmaChecklistAction as {@link Observable}
   */
  public getChecklistActions(
    baseSiteId: string,
    productCode: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]> {
    return this.adapter.getChecklistActions(
      baseSiteId,
      productCode,
      processType
    );
  }

  /**
   * Retrives the checklist actions for multiple product offerings
   *
   * @param baseSiteId The identifier of the base site
   * @param productOfferingCodes The list of product offering code
   * @param processType The identifier of the processType
   * @return The checklist actions as {@link Observable} of {@link TmaChecklistAction}
   */
  public getChecklistActionsFor(
    baseSiteId: string,
    productOfferingCodes: string[],
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]> {
    return this.adapter.getChecklistActionsFor(
      baseSiteId,
      productOfferingCodes,
      processType
    );
  }
}
