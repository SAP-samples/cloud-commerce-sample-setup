// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmfQueryServiceQualificationConfig } from '../../config';

export const defaultTmfQueryServiceQualificationAdapterConfig: TmfQueryServiceQualificationConfig = {
  backend: {
    tmf_query_service_qualification: {
      endpoints: {
        queryServiceQualification: {
          endpoint:
            '/serviceQualificationManagement/v4/queryServiceQualification'
        }
      }
    }
  }
};
