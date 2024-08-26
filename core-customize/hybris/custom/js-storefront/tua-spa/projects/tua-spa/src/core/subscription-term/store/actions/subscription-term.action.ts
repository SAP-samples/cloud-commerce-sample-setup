// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createAction, props } from '@ngrx/store';
import { TmaSubscriptionTerm } from '../../../model';

export const setSubscriptionTerm = createAction(
  ' Set Subscription Term',
  props<{ subscriptionTerm: TmaSubscriptionTerm }>()
);

export const clearSubscriptionTermState = createAction(
  ' Clear Subscription Term State',
);
