// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../..';

export const defaultTmfProductOfferingConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getProductOffering: {
          baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
          prefix: '/b2ctelcotmfwebservices',
          version: '/v3',
          endpoint: '/productOffering/${id}'
        }
      }
    }
  }
};
