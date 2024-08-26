// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfAppointmentConfig } from '../../config';

export const defaultTmfAppointmentAdapterConfig: TmfAppointmentConfig = {
  backend: {
    tmf_appointment: {
      endpoints: {
        getAppointmentById: {
          endpoint: '/appointment/v4/appointment/${id}',
        },
        createAppointment: {
          endpoint: '/appointment/v4/appointment/',
        },
        updateAppointmentById: {
          endpoint: '/appointment/v4/appointment/${id}',
        },
      },
    },
  },
};
