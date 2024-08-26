/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { NgModule } from '@angular/core';
import { ChecklistActionAddToCartEventListener } from './checklist-action-add-to-cart-event.listener';
import { ChecklistActionBuilder } from './checklist-action.builder';


@NgModule({})
export class ChecklistActionEventModule {
  constructor(
    _checklistActionAddToCartEventListener: ChecklistActionAddToCartEventListener,
    _checklistActionBuilder: ChecklistActionBuilder
  ) {
  }
}
