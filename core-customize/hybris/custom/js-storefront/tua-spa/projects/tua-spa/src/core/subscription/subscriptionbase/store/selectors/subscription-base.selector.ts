// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  StateWithSubscriptionBase,
  SUBSCRIPTION_BASE_FEATURE,
  SubscriptionBaseMap,
  SubscriptionBaseState
} from '../subscription-base.state';
import { SubscriptionBase } from '../../../../model';

export const getSubscriptionBaseFeatureState: MemoizedSelector<
  StateWithSubscriptionBase,
  SubscriptionBaseState
> = createFeatureSelector<SubscriptionBaseState>(SUBSCRIPTION_BASE_FEATURE);

export const getAllSubscriptionBase: MemoizedSelector<
  StateWithSubscriptionBase,
  SubscriptionBaseMap[]
> = createSelector(
  getSubscriptionBaseFeatureState,
  (state: SubscriptionBaseState) => state.subscriptionBaseMap
);

export const getSubscriptionBaseForUserId: MemoizedSelectorWithProps<
  StateWithSubscriptionBase,
  any,
  SubscriptionBase[]
> = createSelector(
  getAllSubscriptionBase,
  (state: SubscriptionBaseMap[], props: any) => {
    const subscription: SubscriptionBaseMap = state
      ? state.find(
          (subscriptionBase: SubscriptionBaseMap) =>
            subscriptionBase.userId === props.userId &&
            subscriptionBase.baseSiteId === props.baseSiteId
        )
      : undefined;
    return subscription ? subscription.subscription : [];
  }
);

export const getSubscriptionBaseBySubscriberIdentity: MemoizedSelectorWithProps<
  StateWithSubscriptionBase,
  any,
  SubscriptionBase
> = createSelector(
  getAllSubscriptionBase,
  (state: SubscriptionBaseMap[], props: any) => {
    let subscription: SubscriptionBase;
    if (state) {
      state.find((subscriptionBaseMap: SubscriptionBaseMap) => {
        subscriptionBaseMap.subscription.forEach(
          (subscriptionBase: SubscriptionBase) => {
            if (
              subscriptionBase.subscriberIdentity === props.subscriberIdentity
            ) {
              subscription = subscriptionBase;
            }
          }
        );
      });
    }
    return subscription;
  }
);
