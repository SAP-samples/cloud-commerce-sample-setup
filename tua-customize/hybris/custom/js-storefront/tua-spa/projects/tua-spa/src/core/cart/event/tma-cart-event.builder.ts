// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { ActionsSubject } from '@ngrx/store';
import { EventService, StateEventService } from '@spartacus/core';
import { TmaCartEntryActionTypes } from '../store/actions/tma-cart-entry.action';
import { TmaCartAddEntryEvent } from './tma-cart.events';
import { CartEventBuilder } from '@spartacus/cart/base/core';
import { TmaActiveCartFacade } from '../root';

/**
 * Registers events for the active cart
 */
@Injectable(
  { providedIn: 'root' }
)
export class TmaCartEventBuilder extends CartEventBuilder {

  constructor(
    protected actionsSubject: ActionsSubject,
    protected event: EventService,
    protected activeCartService: TmaActiveCartFacade,
    protected stateEventService: StateEventService
  ) {
    super(actionsSubject, event, activeCartService, stateEventService);
    this.register();
  }

  /**
   * Registers events for the active cart
   */
  protected register() {
    this.registerAddEntry();
  }

  /**
   * Register events for adding entry to the active cart
   */
  protected registerAddEntry() {
    this.registerMapped({
      action: TmaCartEntryActionTypes.ADD_ENTRY,
      event: TmaCartAddEntryEvent
    });
  }
}
