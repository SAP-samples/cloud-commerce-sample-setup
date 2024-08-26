// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { ProductDetailsDialogComponent } from './product-details-dialog.component';

export const defaultProductDetailsDialogLayoutConfig: LayoutConfig = {
  launch: {
    PRODUCT_DETAILS_DIALOG: {
      inline: true,
      component: ProductDetailsDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
