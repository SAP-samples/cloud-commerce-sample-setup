// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../../..';

export const defaultTmfUsageConsumptionConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getUsageConsumptionReports: {
          endpoint: 'usageConsumptionReport'
        },
      },
    },
  },
};
