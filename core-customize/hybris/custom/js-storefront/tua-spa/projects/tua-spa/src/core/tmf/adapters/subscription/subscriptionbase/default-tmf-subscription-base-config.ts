// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../../..';

export const defaultTmfSubscriptionBaseConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSubscriptionBases: {
          endpoint: 'subscriptionBase'
        },
      },
    },
  },
};
