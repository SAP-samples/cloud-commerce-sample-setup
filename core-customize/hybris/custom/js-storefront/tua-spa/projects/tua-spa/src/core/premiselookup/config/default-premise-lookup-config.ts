// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { PremiseLookupConfig } from './premise-lookup-config';

export const defaultPremiseLookupConfig: PremiseLookupConfig = {
  backend: {
    premiseLookup: {
      baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
      prefix: '/b2ctelcomocks/premise/'
    }
  }
};
