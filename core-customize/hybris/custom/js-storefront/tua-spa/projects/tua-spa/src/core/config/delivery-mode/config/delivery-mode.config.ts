// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Config } from '@spartacus/core';

@Injectable({
  providedIn: 'root',
  useExisting: Config
})
export abstract class DeliveryModeConfig {
  deliveryMode?: {
    default_delivery_mode?: string;
  };
}

declare module '@spartacus/core' {
  interface Config extends DeliveryModeConfig {}
}
