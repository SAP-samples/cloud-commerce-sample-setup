// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import {
  StateWithSubscriptionBaseDetail,
  SUBSCRIPTION_BASE_DETAIL_FEATURE,
  SubscriptionBaseDetailMap,
  SubscriptionBaseDetailState
} from '../subscription-base-details.state';
import { SubscriptionBaseDetail } from '../../../../model';

export const getSubscriptionBaseDetailFeatureState: MemoizedSelector<
  StateWithSubscriptionBaseDetail,
  SubscriptionBaseDetailState
> = createFeatureSelector<SubscriptionBaseDetailState>(
  SUBSCRIPTION_BASE_DETAIL_FEATURE
);

export const getAllSubscriptionBaseDetails: MemoizedSelector<
  StateWithSubscriptionBaseDetail,
  SubscriptionBaseDetailMap[]
> = createSelector(
  getSubscriptionBaseDetailFeatureState,
  (state: SubscriptionBaseDetailState) => state.subscriptionBaseDetailMap
);

export const getSubscriptionBaseDetail: MemoizedSelectorWithProps<
  StateWithSubscriptionBaseDetail,
  any,
  SubscriptionBaseDetail
> = createSelector(
  getAllSubscriptionBaseDetails,
  (state: SubscriptionBaseDetailMap[], props: any) => {
    const subscriptionBasedetail: SubscriptionBaseDetailMap = state
      ? state.find(
          (subscriptionBaseDetail: SubscriptionBaseDetailMap) =>
            subscriptionBaseDetail.subscriptionBaseId ===
              props.subscriptionBaseId &&
            subscriptionBaseDetail.baseSiteId === props.baseSiteId
        )
      : undefined;
    return subscriptionBasedetail
      ? subscriptionBasedetail.subscriptionBaseDetail
      : undefined;
  }
);
