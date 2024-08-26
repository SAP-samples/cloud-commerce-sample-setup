// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SUBSCRIPTION_TERM_FEATURE, SubscriptionTermState } from '../subscription-term.state';

export const subscriptionTermState = createFeatureSelector<SubscriptionTermState>(
  SUBSCRIPTION_TERM_FEATURE
);

export const getSelectedSubscriptionTerm = createSelector(
  subscriptionTermState,
  (state) => state.selectedSubscriptionTerm
);

export const getSelectedSubscriptionTermId = createSelector(
  subscriptionTermState,
  (state) =>
    state.selectedSubscriptionTerm
      ? state.selectedSubscriptionTerm.id
      : undefined
);
