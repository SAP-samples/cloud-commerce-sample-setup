// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfQueryServiceQualificationConfig } from './tmf-query-service-qualification-config';

export const defaultTmfQueryServiceQualificationConfig: TmfQueryServiceQualificationConfig = {
  backend: {
    tmf_query_service_qualification: {
      baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
      prefix: '/b2ctelcomocks'
    }
  }
};
