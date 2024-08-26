// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../../..';

export const defaultTmfSubscriptionBaseDetailsConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getSubscriptionBase: {
          endpoint: 'subscriptionbase/${subscriberId}'
        },
      },
    },
  },
};
