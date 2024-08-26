// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaSliderOption } from './tma-po-search-by-consumption.model';

export const SEPARATOR = '_';

export interface TmaConsumptionValue {
  productSpecification: string;
  usageUnit: string;
  consumptionOption: TmaSliderOption;
}
