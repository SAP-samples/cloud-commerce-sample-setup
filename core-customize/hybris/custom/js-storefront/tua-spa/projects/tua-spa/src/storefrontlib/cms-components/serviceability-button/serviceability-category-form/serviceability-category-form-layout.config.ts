// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { ServiceabilityCategoryFormComponent } from './serviceability-category-form.component';

export const defaultServiceabilityCategoryFormLayoutConfig: LayoutConfig = {
  launch: {
    SERVICEABILITY_CATEGORY_FORM: {
      inline: true,
      component: ServiceabilityCategoryFormComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
