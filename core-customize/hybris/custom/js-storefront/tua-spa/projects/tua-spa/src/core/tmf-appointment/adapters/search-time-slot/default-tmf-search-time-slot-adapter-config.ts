// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfAppointmentConfig } from '../../config';

export const defaultTmfSearchTimeSlotAdapterConfig: TmfAppointmentConfig = {
  backend: {
    tmf_appointment: {
      endpoints: {
        searchTimeSlot: {
          baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
          prefix: '/b2ctelcomocks',
          endpoint: '/appointment/v4/searchTimeSlot',
        },
      },
    },
  },
};
