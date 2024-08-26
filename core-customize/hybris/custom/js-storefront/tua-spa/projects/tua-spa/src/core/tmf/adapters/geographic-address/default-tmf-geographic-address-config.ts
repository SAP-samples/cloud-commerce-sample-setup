// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../..';
import { LOCAL_STORAGE } from '../../../util';

const { LOCALHOST } = LOCAL_STORAGE.HTTP_LINKS;

export const defaultTmfGeographicAddressConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        createGeographicAddress: {
          endpoint: 'geographicAddress'
        },
        updateGeographicAddress: {
          baseUrl: LOCALHOST,
          prefix: '/b2ctelcotmfwebservices',
          version: '/v3',
          endpoint: 'geographicAddress/${id}'
        },
      },
    },
  },
};
