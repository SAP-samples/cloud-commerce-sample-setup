// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import * as SubscriptionBaseDetailSelectors from '../store/selectors/subscription-base-details.selector';
import { tap } from 'rxjs/operators';
import { StateWithSubscriptionBaseDetail } from '../store';
import * as SubscriptionBaseDetailsActions from '../store/actions/subscription-base-details.action';
import { BaseSiteService } from '@spartacus/core';
import { SubscriptionBaseDetail } from '../../../model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionBaseDetailsService implements OnDestroy{
  protected baseSiteId: string;
  protected subscription = new Subscription();

  constructor(
    protected store: Store<StateWithSubscriptionBaseDetail>,
    protected baseSiteService: BaseSiteService
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns the details of SubscriptionBase like list of Products, relatedParty and other details.
   * @param subscriptionBaseId The identifier of the subscription base
   * @returns SubscriptionBase details {@link SubscriptionBaseDetail} as an {@link Observable}
   */

  getSubscriptionBaseDetails(
    subscriptionBaseId: string
  ): Observable<SubscriptionBaseDetail> {
    return this.store.pipe(
      select(SubscriptionBaseDetailSelectors.getSubscriptionBaseDetail, {
        baseSiteId: this.baseSiteId,
        subscriptionBaseId: subscriptionBaseId,
      }),
      tap((subscriptionBaseDetails: SubscriptionBaseDetail) => {
        if (subscriptionBaseDetails == null) {
          this.loadSubscriptionDetails(this.baseSiteId, subscriptionBaseId);
        }
      })
    );
  }

  /**
   * Loads the SubscriptionBase details.
   *
   * @param baseSiteId The identifier of the base site
   * @param subscriptionBaseId The identifier of the SubscriptionBase
   */
  loadSubscriptionDetails(
    baseSiteId: string,
    subscriptionBaseId: string
  ): void {
    this.store.dispatch(
      new SubscriptionBaseDetailsActions.LoadSubscriptionBaseDetails({
        baseSiteId,
        subscriptionBaseId,
      })
    );
  }

  /**
   * Clears the SubscriptionBase details.
   */
  clearSubscriptionBaseDetails(): void {
    this.store.dispatch(
      new SubscriptionBaseDetailsActions.ClearSubscriptionBaseDetails()
    );
  }
}
