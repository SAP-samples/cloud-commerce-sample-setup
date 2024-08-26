// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfResourcePoolManagementConfig } from '../../config';

export const defaultTmfReservationConfig: TmfResourcePoolManagementConfig = {
  backend: {
    tmf_resource_pool_management: {
      endpoints: {
        postReservation: {
          endpoint: 'resourcePoolManagement/reservation'
        },
        updateReservation: {
          endpoint: 'resourcePoolManagement/reservation/${id}'
        },
        getReservationById: {
          endpoint: 'resourcePoolManagement/reservation'
        }
      }
    }
  }
};
