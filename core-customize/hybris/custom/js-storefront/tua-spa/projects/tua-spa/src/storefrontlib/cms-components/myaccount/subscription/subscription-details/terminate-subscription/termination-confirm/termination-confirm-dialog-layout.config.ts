// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

/*
 * SPDX-FileCopyrightText: 2022 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { TerminationConfirmComponent } from './termination-confirm.component';

export const defaultTerminationConfirmDialogLayoutConfig: LayoutConfig = {
  launch: {
    TMA_TERMINATION_CONFIRM: {
      inlineRoot: true,
      component: TerminationConfirmComponent,
      dialogType: DIALOG_TYPE.DIALOG,
    },
  },
};
