// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfResourcePoolManagementConfig } from './tmf-resource-pool-management-config';

export const defaultResourceTmfConfig: TmfResourcePoolManagementConfig = {
  backend: {
    tmf_resource_pool_management: {
      baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
      prefix: '/b2ctelcomocks'
    }
  }
};
