// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { BaseSiteService, User } from '@spartacus/core';
import { UsageConsumptionReport } from '../../../model';
import * as UsageConsumptionSelector from '../store/selectors/usage-consumption.selector';
import * as UsageConsumptionAction from '../store/actions/usage-consumption.action';
import { StateWithUsageConsumption } from '../store';

@Injectable()
export class UsageConsumptionService implements OnDestroy {
  protected baseSiteId: string;
  protected user: User;
  protected subscription = new Subscription();

  constructor(
    protected usageStore: Store<StateWithUsageConsumption>,
    protected baseSiteService: BaseSiteService
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId) => (this.baseSiteId = baseSiteId))
      );
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Returns a UsageConsumption details
   * @param subscriptionId The identifier of the subscription base
   * @returns UsageConsumption details {@link UsageConsumptionReport} as an {@link Observable}
   */
  fetchUsageConsumption(
    subscriptionId: string
  ): Observable<UsageConsumptionReport> {
    return this.usageStore.pipe(
      select(UsageConsumptionSelector.getUsageConsumptionForSubscriptionId, {
        baseSiteId: this.baseSiteId,
        subscriptionId: subscriptionId,
      }),
      tap((usageConsumptionReport: UsageConsumptionReport) => {
        if (usageConsumptionReport == null) {
          this.loadUsageConsumptionDetails(this.baseSiteId, subscriptionId);
        }
      })
    );
  }

  /**
   * Loads the UsageConsumption details.
   *
   * @param baseSiteId The identifier of the base site
   * @param subscriptionId The identifier of the SubscriptionBase
   */
  loadUsageConsumptionDetails(
    baseSiteId: string,
    subscriptionId: string
  ): void {
    this.usageStore.dispatch(
      new UsageConsumptionAction.LoadUsageConsumption({
        baseSiteId,
        subscriptionId,
      })
    );
  }

  /**
   * Clears the UsageConsumption details.
   */
  clearUsageConsumptionDetails(): void {
    this.ngOnDestroy();
    this.usageStore.dispatch(
      new UsageConsumptionAction.ClearUsageConsumptionDetails()
    );
  }
}
