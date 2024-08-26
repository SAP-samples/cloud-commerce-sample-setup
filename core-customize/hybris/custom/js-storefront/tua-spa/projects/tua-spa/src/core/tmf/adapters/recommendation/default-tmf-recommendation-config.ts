// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../../config/tmf-config';

export const defaultTmfRecommendationConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getRecommendations: {
          endpoint: 'recommendation'
        }
      },
    },
  },
};
