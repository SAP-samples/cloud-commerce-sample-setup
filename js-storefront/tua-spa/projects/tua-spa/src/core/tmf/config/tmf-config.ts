// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SiteContextConfig } from '@spartacus/core';
import { TmfEndpointMap } from '../tmf-models/tmf-endpoint.model';

export abstract class TmfConfig extends SiteContextConfig {
  backend?: {
    tmf?: {
      baseUrl?: string;
      prefix?: string;
      version?: string;
      endpoints?: TmfEndpointMap;
      legacy?: boolean;
    };
    media?: {
      /**
       * Media URLs are typically relative, so that the host can be configured.
       * Configurable media baseURLs are useful for SEO, multi-site,
       * switching environments, etc.
       */
      baseUrl?: string;
    };
  };
}
