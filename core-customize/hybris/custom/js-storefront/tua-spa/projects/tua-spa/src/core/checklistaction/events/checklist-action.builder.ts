/*
 * SPDX-FileCopyrightText: 2023 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { Injectable } from '@angular/core';
import { ChecklistActionAddToCartEvent } from './checklist-action.events';
import { StateEventService } from '@spartacus/core';
import { TmaChecklistActionTypes } from '../store/actions/tma-checklist-action.action';

@Injectable()
export class ChecklistActionBuilder {
  constructor(protected stateEventService: StateEventService) {
    this.register();
  }

  /**
   * Registers user events
   */
  protected register(): void {
    this.checklistActionsAddToCartEvent();
  }

  /**
   * Register an address successfully updated event
   */
  protected checklistActionsAddToCartEvent(): void {
    this.stateEventService.register({
      action: TmaChecklistActionTypes.CHECKLIST_ACTIONS_WITH_ADD_TO_CART_DETAILS,
      event: ChecklistActionAddToCartEvent
    });
  }
}
