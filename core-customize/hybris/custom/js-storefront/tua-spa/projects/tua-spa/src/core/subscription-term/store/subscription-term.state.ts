// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaSubscriptionTerm } from '../../model';

export const SUBSCRIPTION_TERM_FEATURE = 'Subscription Term';

export interface SubscriptionTermState {
  selectedSubscriptionTerm: TmaSubscriptionTerm;
}

export const initialSubscriptionTermState: SubscriptionTermState = {
  selectedSubscriptionTerm: undefined
};
