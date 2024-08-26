// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { TmaGuidedSellingAddedToCartDialogComponent } from './tma-guided-selling-added-to-cart-dialog.component';

export const defaultTmaGuidedSellingAddToCartDialogLayoutConfig: LayoutConfig = {
  launch: {
    TMA_GUIDED_SELLING_ADD_TO_CART: {
      inline: true,
      component: TmaGuidedSellingAddedToCartDialogComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
