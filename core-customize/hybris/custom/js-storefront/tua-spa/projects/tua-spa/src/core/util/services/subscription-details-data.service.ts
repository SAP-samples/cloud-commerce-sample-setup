// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TmfProductMap } from '../../subscription';

@Injectable({
    providedIn: 'root'
})
export class SubscriptionDetailDataService {

  protected subscriptionDetail: TmfProductMap;
  protected subscriptionDetailSource: BehaviorSubject<TmfProductMap> = new BehaviorSubject({});
  protected _subscriptionDetail$ = this.subscriptionDetailSource.asObservable();

  constructor() {
    const subscription = localStorage.getItem('subscription');
    if (subscription) {
      this.updateSubscriptionDetail(JSON.parse(subscription), false);
    }
  }

  /**
   * Updates the subscription details
   *
   * @param subscriptionDetail - The subscription detail
   * @param storeSubscription - subscription stored in local storage
   */
  updateSubscriptionDetail(subscriptionDetail: TmfProductMap, storeSubscription: boolean) {
    if (storeSubscription) {
      localStorage.setItem('subscription', JSON.stringify(subscriptionDetail));
    }
    this.subscriptionDetailSource.next(subscriptionDetail);
  }

  get getSubscriptionDetail(): Observable<TmfProductMap> {
    return this._subscriptionDetail$;
  }
}
