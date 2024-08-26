// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { TmaAddedToCartDialogComponent } from './tma-added-to-cart-dialog.component';

export const defaultAddedToCartLayoutConfig: LayoutConfig = {
  launch: {
    ADDED_TO_CART: {
      inlineRoot: true,
      component: TmaAddedToCartDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
