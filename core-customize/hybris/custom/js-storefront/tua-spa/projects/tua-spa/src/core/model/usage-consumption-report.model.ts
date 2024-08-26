// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Product } from '@spartacus/core';
import { TmaTimePeriod } from './tma-common.model';

export interface UsageConsumptionReport {
  bucket?: BucketRef[];
}

export interface BucketRef {
  bucketBalance?: BucketBalanceRef[];
  bucketCounter?: BucketCounterRef[];
  id?: string;
  name?: string;
  usageType?: string;
  product?: Product;
}

export interface BucketBalanceRef {
  remainingValue?: number;
  remainingValueLabel?: string;
  unit?: string;
  validFor?: TmaTimePeriod;
}

export interface BucketCounterRef {
  value?: number;
  valueLabel?: string;
  unit?: string;
  validFor?: TmaTimePeriod;
}

export interface DoughnutChartDataRef {
  data?: number[];
  backgroundColor?: string[];
}

