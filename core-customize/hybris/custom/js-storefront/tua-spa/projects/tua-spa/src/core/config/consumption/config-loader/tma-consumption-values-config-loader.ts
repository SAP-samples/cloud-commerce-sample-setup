// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TmaConsumptionConfig } from '../config';
import { TmaSliderOption } from '../../../model';

@Injectable({ providedIn: 'root' })
export class TmaConsumptionValuesConfigLoader {
  constructor(
    protected config: TmaConsumptionConfig
  ) {
  }

  private get defaultValues(): any[] {
    return this.config.consumption.defaultValues;
  }

  private get default(): TmaSliderOption {
    return this.config.consumption.default;
  }

  load() {
    return (!this.config || !this.config.consumption || !this.config.consumption.defaultValues || !this.config.consumption.default) ? throwError(new Error(`Missing config for consumption!`)) : of(undefined);
  }
}
