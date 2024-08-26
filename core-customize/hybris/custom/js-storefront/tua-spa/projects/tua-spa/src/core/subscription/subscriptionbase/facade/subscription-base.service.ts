// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as SubscriptionBaseSelectors from '../store';
import { StateWithSubscriptionBase } from '../store';
import { tap } from 'rxjs/operators';
import { SubscriptionBase } from '../../../model';
import * as SubscriptionBaseActions from '../store/actions/subscription-base.action';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseService {

  constructor(
    protected store: Store<StateWithSubscriptionBase>
  ) {
  }

  /**
   * Returns a list of subscription bases.
   *
   * @return List of {@link SubscriptionBase} as an {@link Observable}
   */
  getListOfSubscriptionBases(baseSiteId: string, userId: string): Observable<SubscriptionBase[]> {
    return this.store.pipe(
      select(SubscriptionBaseSelectors.getSubscriptionBaseForUserId, {
        baseSiteId: baseSiteId,
        userId: userId,
      }),
      tap((subscriptionBases: SubscriptionBase[]) => {
        if (subscriptionBases?.length === 0) {
          this.loadSubscriptions(baseSiteId, userId);
        }
      })
    );
  }

  /**
   * Loads the user's subscriptions.
   *
   * @param baseSiteId The identifier of the base site
   * @param userId The identifier of the user
   */
  loadSubscriptions(baseSiteId: string, userId: string): void {
    this.store.dispatch(
      new SubscriptionBaseActions.LoadSubscriptionBase({
        baseSiteId,
        userId,
      })
    );
  }

  /**
   * Clears the subscription base list.
   */
  clearSubscriptionBaseList(): void {
    this.store.dispatch(new SubscriptionBaseActions.ClearAllSubscriptionBase());
  }
}
