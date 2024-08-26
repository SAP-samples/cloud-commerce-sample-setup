// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../../..';

export const defaultTmfProductConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getProduct: {
          baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
          prefix: '/b2ctelcotmfwebservices',
          version: '/v3',
          endpoint: '/product/${id}'
        },
      },
    },
  },
};
