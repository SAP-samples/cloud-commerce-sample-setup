// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { SubscriptionBaseDetail } from '../../../../model';

export abstract class SubscriptionBaseDetailsAdapter {
  /**
   * Abstract method used to get the subscription base details
   * @param baseSiteId The identifier of the base site
   * @param subscriptionBaseId The identifier of the subscription base
   * @returns Observable of SubscriptionBaseDetail
   */
  abstract getSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string
  ): Observable<SubscriptionBaseDetail[]>;
}
