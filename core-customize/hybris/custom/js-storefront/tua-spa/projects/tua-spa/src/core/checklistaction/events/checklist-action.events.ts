/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CxEvent } from '@spartacus/core';

/**
 * Emit this event to get required details for add to cart based on checklist actions
 */
export class ChecklistActionAddToCartEvent extends CxEvent {
  /**
   * Event's type
   */
  static readonly type = 'ChecklistActionAddToCartEvent';
}
