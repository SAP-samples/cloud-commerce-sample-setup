// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { CmsComponent } from '@spartacus/core';

export interface TmaCmsConsumptionComponent extends CmsComponent {
  container?: string;
  searchByConsumptionComponents?: any[];
}
