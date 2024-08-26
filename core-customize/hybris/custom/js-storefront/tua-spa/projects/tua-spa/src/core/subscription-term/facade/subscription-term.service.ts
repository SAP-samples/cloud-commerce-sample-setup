// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TmaSubscriptionTerm } from '../../model';
import { clearSubscriptionTermState, setSubscriptionTerm } from '../store/actions/subscription-term.action';
import { getSelectedSubscriptionTerm, getSelectedSubscriptionTermId } from '../store/selectors/subscription-term.selectors';
import { SubscriptionTermState } from '../store/subscription-term.state';

@Injectable()
export class SubscriptionTermService {
  constructor(protected store: Store<SubscriptionTermState>) {}

  /**
   * Retrieves the Selected Subscription term.
   *
   * @return subscription term as {@link Observable} of {@link TmaSubscriptionTerm}
   */
  getSelectedSubscriptionTerm(): Observable<TmaSubscriptionTerm> {
    return this.store.pipe(select(getSelectedSubscriptionTerm));
  }

  /**
   * Retrieves the Selected Subscription term Id.
   *
   * @return subscription term Id as {@link Observable} of {@link string}
   */
  getSelectedSubscriptionTermId(): Observable<string> {
    return this.store.pipe(select(getSelectedSubscriptionTermId));
  }

  /**
   * Sets the Selected Subscription term in state.
   *
   * @param subscriptionTerm
   *         The Selected Subscription Term as {@link TmaSubscriptionTerm}
   */
  setSubscriptionTerm(subscriptionTerm: TmaSubscriptionTerm) {
    this.store.dispatch(setSubscriptionTerm({ subscriptionTerm }));
  }

  /**
   * Clear the Selected Subscription term from state.
   */
  clearSelectedSubscriptionTerm() {
    this.store.dispatch(clearSubscriptionTermState());
  }
}
