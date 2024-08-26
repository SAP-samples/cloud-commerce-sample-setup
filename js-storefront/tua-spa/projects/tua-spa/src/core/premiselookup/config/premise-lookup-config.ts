// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { BackendConfig, Config, SiteContextConfig } from '@spartacus/core';
import { PremiseLookupEndpoints } from '../models';

interface PremiseLookupBackendConfig extends BackendConfig {
  premiseLookup?: {
    baseUrl?: string;
    prefix?: string;
    endpoints?: PremiseLookupEndpoints;
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config
})
export abstract class PremiseLookupConfig extends SiteContextConfig {
  backend?: PremiseLookupBackendConfig;
}

