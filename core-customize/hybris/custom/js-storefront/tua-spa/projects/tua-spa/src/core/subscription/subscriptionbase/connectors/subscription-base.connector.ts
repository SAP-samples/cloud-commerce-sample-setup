// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { SubscriptionBaseAdapter } from '../store/adapters';
import { Observable } from 'rxjs';
import { SubscriptionBase } from '../../../model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseConnector {
  constructor(protected adapter: SubscriptionBaseAdapter) {}

  public getListOfSubscriptionBase(
    baseSiteId: string,
    userId: string
  ): Observable<SubscriptionBase[]> {
    return this.adapter.getListOfSubscriptionBase(baseSiteId, userId);
  }
}
