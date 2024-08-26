// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaConsumptionConfig } from './tma-consumption-config';

export const defaultTmaConsumptionConfig: TmaConsumptionConfig = {
  consumption: {
    defaultValues: [
      { productSpecification: 'electricity', usageUnit: 'kwh', consumptionOption: {
        uid: 'OnePersonElectricitySliderOption',
        name: '1 Habitant = 1000 kwh',
        value: 1000
      } },
      { productSpecification: 'gas', usageUnit: 'cubic_meter', consumptionOption: {
        uid: 'ThirtyM2GasSliderOption',
        name: '30 sq m = 1000 cubic meters',
        value: 1000
      }}
    ],
    default: {
      uid: 'OnePersonElectricitySliderOption',
      name: '1 Habitant = 1000 kwh',
      value: 1000
    }
  }
};
