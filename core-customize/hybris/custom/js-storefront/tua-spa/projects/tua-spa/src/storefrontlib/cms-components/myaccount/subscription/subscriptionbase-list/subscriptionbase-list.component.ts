// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  SubscriptionBase,
  SubscriptionBaseDetail,
  SubscriptionBaseDetailsService,
  SubscriptionBaseRef,
  SubscriptionBaseService
} from '../../../../../core';
import { BaseSiteService, User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Component({
  selector: 'cx-subscription-history',
  templateUrl: './subscriptionbase-list.component.html',
  styleUrls: ['./subscriptionbase-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SubscriptionBaseListComponent implements OnInit, OnDestroy {
  subscriptions$: Observable<SubscriptionBase[]>;
  protected baseSiteId: string;
  protected user: User;
  protected subscription = new Subscription();

  constructor(
    protected subscriptionService: SubscriptionBaseService,
    protected subscriptionDetailService: SubscriptionBaseDetailsService,
    protected userAccountFacade: UserAccountFacade,
    protected baseSiteService: BaseSiteService,
    protected cd: ChangeDetectorRef
  ) {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );
  }

  ngOnInit(): void {
    this.subscription.add(
      this.userAccountFacade
        .get()
        .subscribe((customer: User) => {
          if(customer !== undefined) {
            this.subscriptions$ = this.subscriptionService.getListOfSubscriptionBases(this.baseSiteId, customer.uid);
            this.cd.detectChanges();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionService.clearSubscriptionBaseList();
    this.subscriptionDetailService.clearSubscriptionBaseDetails();
  }

  getSubscriptionDetails(
    subscriberId: string
  ): Observable<SubscriptionBaseDetail> {
    return this.subscriptionDetailService.getSubscriptionBaseDetails(
      subscriberId
    );
  }

  getSubscriptionLength(subscription: SubscriptionBaseRef): number {
    if (!!subscription.product) {
      return subscription.product.length;
    }
    return 0;
  }
}
