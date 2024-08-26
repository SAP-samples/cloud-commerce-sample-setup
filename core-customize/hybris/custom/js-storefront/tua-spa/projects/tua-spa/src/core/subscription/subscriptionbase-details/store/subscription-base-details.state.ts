// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SubscriptionBaseDetail } from '../../../model';

export const SUBSCRIPTION_BASE_DETAIL_FEATURE = 'subscription-base detail';

export interface StateWithSubscriptionBaseDetail {
  [SUBSCRIPTION_BASE_DETAIL_FEATURE]: SubscriptionBaseDetailState;
}

export class SubscriptionBaseDetailMap {
  baseSiteId: string;
  subscriptionBaseId: string;
  subscriptionBaseDetail: SubscriptionBaseDetail;
}

export interface SubscriptionBaseDetailState {
  subscriptionBaseDetailMap: SubscriptionBaseDetailMap[];
}
