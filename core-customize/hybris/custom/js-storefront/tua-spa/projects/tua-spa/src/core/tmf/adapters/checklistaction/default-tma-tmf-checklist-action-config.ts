// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfConfig } from '../..';

export const defaultTmaTmfChecklistActionConfig: TmfConfig = {
  backend: {
    tmf: {
      endpoints: {
        getChecklistAction: {
          endpoint: 'checklistAction'
        },
      },
    },
  },
};
