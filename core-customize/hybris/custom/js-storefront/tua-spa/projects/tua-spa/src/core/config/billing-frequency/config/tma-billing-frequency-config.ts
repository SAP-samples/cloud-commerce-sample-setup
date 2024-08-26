// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

export interface TmaBillingFrequencyMap {
  key: string;
  value: number;
}

export abstract class TmaBillingFrequencyConfig {
  billingFrequency?: TmaBillingFrequencyMap[];
}
