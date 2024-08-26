// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { TmaConsumptionLoadedConfig } from './tma-consumption-loaded-config';

@Injectable({ providedIn: 'root' })
export class TmaConsumptionLoadedConfigConverter {

  fromConsumptionConfig(consumptionConfig: TmaConsumptionLoadedConfig): TmaConsumptionLoadedConfig {
    return {
      defaultValues: consumptionConfig.defaultValues,
      default: consumptionConfig.default
    };
  }
}
