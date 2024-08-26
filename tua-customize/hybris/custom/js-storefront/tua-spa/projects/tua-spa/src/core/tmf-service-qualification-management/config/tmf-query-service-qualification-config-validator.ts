// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfQueryServiceQualificationConfig } from './tmf-query-service-qualification-config';

export function tmfQueryServiceQualificationConfigValidator(config: TmfQueryServiceQualificationConfig): string | undefined {
  if (!config || !config.backend || !config.backend.tmf_query_service_qualification || !config.backend.tmf_query_service_qualification.baseUrl) {
    return 'Please configure backend.query_service_qualification.baseUrl before using storefront library!';
  }
  return undefined;
}
