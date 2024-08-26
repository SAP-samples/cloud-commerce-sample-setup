// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { ServiceabilityFormComponent } from './serviceability-form.component';

export const defaultServiceabilityFormLayoutConfig: LayoutConfig = {
  launch: {
    SERVICEABILITY_FORM: {
      inline: true,
      component: ServiceabilityFormComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
