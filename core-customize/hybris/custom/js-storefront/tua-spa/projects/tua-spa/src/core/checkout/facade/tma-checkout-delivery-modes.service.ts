// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import {
  CheckoutDeliveryModesConnector,
  CheckoutDeliveryModesService
} from '@spartacus/checkout/base/core';
import { CheckoutDeliveryModeSetEvent, CheckoutDeliveryModesFacade } from '@spartacus/checkout/base/root';
import { ActiveCartFacade, DeliveryMode } from '@spartacus/cart/base/root';
import {
  Command,
  CommandService,
  CommandStrategy,
  EventService,
  QueryService,
  UserIdService
} from '@spartacus/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TmaCheckoutQueryService } from './tma-checkout-query.service';

@Injectable({
  providedIn: 'root'
})
export class TmaCheckoutDeliveryModesService extends CheckoutDeliveryModesService implements CheckoutDeliveryModesFacade {
  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected eventService: EventService,
    protected queryService: QueryService,
    protected commandService: CommandService,
    protected checkoutDeliveryModesConnector: CheckoutDeliveryModesConnector,
    protected checkoutQueryFacade: TmaCheckoutQueryService
  ) {
    super(activeCartFacade, userIdService, eventService, queryService, commandService, checkoutDeliveryModesConnector, checkoutQueryFacade);
  }

  protected setDeliveryModeToCartCommand: Command<{cartId: string; userId: string; mode: string}, unknown> =
    this.commandService.create<{cartId: string; userId: string; mode: string}>(
      (payload) => {
       return this.checkoutDeliveryModesConnector
          .setMode(payload.userId, payload.cartId, payload.mode)
          .pipe(
            tap(() => {
              const deliveryModeCode = payload.mode;
              const cartId = payload.cartId;
              const userId = payload.userId;
              this.eventService.dispatch(
                { userId, cartId, cartCode: cartId, deliveryModeCode },
                CheckoutDeliveryModeSetEvent
              );
            })
          );
      },

      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  setDeliveryModeToCart(cartId: string, userId: string, mode: string): Observable<unknown> {
    return this.setDeliveryModeToCartCommand.execute({cartId, userId, mode});
  }

  getSelectedDeliveryModeStateForCart(cartId: string, userId: string): Observable<DeliveryMode | undefined> {
    return this.checkoutQueryFacade.getCheckoutDetailsStateForCart(cartId, userId).pipe(
      map((state) => ({
        ...state.deliveryMode
      }))
    );
  }
}
