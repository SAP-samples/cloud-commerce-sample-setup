// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfAppointmentConfig } from './tmf-appointment-config';

export const defaultTmfAppointmentConfig: TmfAppointmentConfig = {
  backend: {
    tmf_appointment: {
      baseUrl: 'https://api.cy8u-telcoacce1-s12-public.model-t.cc.commerce.ondemand.com',
      prefix: '/b2ctelcomocks',
    },
  },
};
