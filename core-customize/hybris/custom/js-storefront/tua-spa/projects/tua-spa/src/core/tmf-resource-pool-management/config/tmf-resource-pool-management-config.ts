// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { BackendConfig, Config, SiteContextConfig } from '@spartacus/core';
import { TmfResourcePoolManagementEndpointMap } from '../tmf-resource-pool-management-models';

interface TmfResourcePoolManagementBackendConfig extends BackendConfig {
  tmf_resource_pool_management?: {
    baseUrl?: string;
    prefix?: string;
    endpoints?: TmfResourcePoolManagementEndpointMap;
  };
}

@Injectable({
  providedIn: 'root',
  useExisting: Config
})
export abstract class TmfResourcePoolManagementConfig extends SiteContextConfig {
  backend?: TmfResourcePoolManagementBackendConfig;
}
