// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { InjectionToken } from '@angular/core';
import { Converter } from '@spartacus/core';
import { SubscriptionBase } from '../../../model';

export const SUBSCRIPTION_BASE_NORMALIZER = new InjectionToken<
  Converter<any, SubscriptionBase>
>('SubscriptionBaseNormalizer');
