// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { TmaChecklistAction, TmaProcessTypeEnum } from '../../../model';

export abstract class TmaChecklistActionAdapter {
  /**
   * Abstract method used to get the checklist actions
   * @param baseSiteId The identifier of the base site
   * @param productId The identifier of the product
   * @param  processType The identifier of the processType
   * @return The TmaChecklistAction as {@link Observable}
   */
  abstract getChecklistActions(
    baseSiteId: string,
    productId: string,
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]>;

  /**
   * Retrives the checklist actions for multiple product offerings
   *
   * @param baseSiteId The identifier of the base site
   * @param productOfferingCodes The list of product offering code
   * @param processType The identifier of the processType
   * @return The checklist actions as {@link Observable} of {@link TmaChecklistAction}
   */
  abstract getChecklistActionsFor(
    baseSiteId: string,
    productOfferingCodes: string[],
    processType?: TmaProcessTypeEnum
  ): Observable<TmaChecklistAction[]>;
}
