// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from './tmf-config';

export function tmfConfigValidator(config: TmfConfig): string | undefined {
  if (
    config.backend === undefined ||
    config.backend.tmf === undefined ||
    config.backend.tmf.baseUrl === undefined
  ) {
    return 'Please configure backend.tmf.baseUrl before using storefront library!';
  }

  return undefined;
}
