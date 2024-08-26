// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../..';

export const defaultTmaTmfCartConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        updateShoppingCart: {
          endpoint: 'shoppingCart/${id}'
        },
      },
    },
  },
};
