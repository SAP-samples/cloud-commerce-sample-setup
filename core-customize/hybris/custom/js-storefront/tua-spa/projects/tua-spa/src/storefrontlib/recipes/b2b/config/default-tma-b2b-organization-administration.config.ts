// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CmsConfig } from '@spartacus/core';

export const defaultTmaB2bOrganizationAdministrationConfig: CmsConfig = {
  featureModules: {
    organizationAdministration: {
      module: () => import('@spartacus/organization/administration').then(
        (m) => m.AdministrationModule
      )
    }
  }
};
