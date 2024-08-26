// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { BackendConfig, Config, SiteContextConfig } from '@spartacus/core';
import { TmfQueryServiceQualificationEndpointMap } from '..';

interface TmfQueryServiceQualificationBackendConfig extends BackendConfig {
  tmf_query_service_qualification?: {
    baseUrl?: string;
    prefix?: string;
    endpoints?: TmfQueryServiceQualificationEndpointMap;
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config
})
export abstract class TmfQueryServiceQualificationConfig extends SiteContextConfig {
  backend?: TmfQueryServiceQualificationBackendConfig;
}
