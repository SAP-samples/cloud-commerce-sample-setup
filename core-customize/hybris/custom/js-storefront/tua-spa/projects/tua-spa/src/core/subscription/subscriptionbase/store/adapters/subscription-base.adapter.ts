// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { SubscriptionBase } from '../../../../model';

export abstract class SubscriptionBaseAdapter {
  /**
   * Abstract method used to get the list of subscriptionBase
   * @param baseSiteId The identifier of the base site
   * @param userId The identifier of the user
   * @returns list of {@link SubscriptionBase} as Observable
   */
  abstract getListOfSubscriptionBase(
    baseSiteId: string,
    userId: string
  ): Observable<SubscriptionBase[]>;
}
