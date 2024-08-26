// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SubscriptionBase } from '../../../model';

export const SUBSCRIPTION_BASE_FEATURE = 'subscription-base';

export interface StateWithSubscriptionBase {
  [SUBSCRIPTION_BASE_FEATURE]: SubscriptionBaseState;
}

export class SubscriptionBaseMap {
  userId: string;
  baseSiteId: string;
  subscription: SubscriptionBase[];
}
export interface SubscriptionBaseState {
  subscriptionBaseMap?: SubscriptionBaseMap[];
}
