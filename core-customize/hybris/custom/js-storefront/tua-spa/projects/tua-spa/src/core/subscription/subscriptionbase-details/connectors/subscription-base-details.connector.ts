// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubscriptionBaseDetailsAdapter } from '../store/adapters';
import { SubscriptionBaseDetail } from '../../../model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseDetailsConnector {
  constructor(protected adapter: SubscriptionBaseDetailsAdapter) {
  }

  public getSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string,
  ): Observable<SubscriptionBaseDetail[]> {
    return this.adapter.getSubscriptionDetails(baseSiteId, subscriptionBaseId);
  }
}
