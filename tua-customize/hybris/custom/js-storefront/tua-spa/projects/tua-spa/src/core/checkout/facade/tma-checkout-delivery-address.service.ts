// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import {
  CheckoutDeliveryAddressConnector,
  CheckoutDeliveryAddressService
} from '@spartacus/checkout/base/core';
import {
  CheckoutDeliveryAddressFacade,
  CheckoutDeliveryAddressSetEvent
} from '@spartacus/checkout/base/root';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { Address, Command, CommandService, CommandStrategy, EventService, UserIdService } from '@spartacus/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TmaCheckoutQueryService } from './tma-checkout-query.service';

@Injectable({
  providedIn: 'root'
})
export class TmaCheckoutDeliveryAddressService extends CheckoutDeliveryAddressService implements CheckoutDeliveryAddressFacade {
  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected eventService: EventService,
    protected commandService: CommandService,
    protected checkoutDeliveryAddressConnector: CheckoutDeliveryAddressConnector,
    protected checkoutQueryFacade: TmaCheckoutQueryService
  ) {
    super(activeCartFacade, userIdService, eventService, commandService, checkoutDeliveryAddressConnector, checkoutQueryFacade);
  }

  setDeliveryAddressCommandToCart: Command<{ address: Address; cartId: string; userId: string }, unknown> =
    this.commandService.create<{ address: Address; cartId: string; userId: string }>(
      (payload) => {
        const address = payload.address;
        const cartId = payload.cartId;
        const userId = payload.userId;
        if (!address.id) {
          throw new Error('Checkout conditions not met');
        }
        return this.checkoutDeliveryAddressConnector
          .setAddress(userId, cartId, address.id)
          .pipe(
            tap(() => {
              this.eventService.dispatch(
                {
                  userId,
                  cartId,
                  address,
                },
                CheckoutDeliveryAddressSetEvent
              );
            })
          );
      },

      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  setDeliveryAddressToCart(address: Address, cartId: string, userId: string): Observable<unknown> {
    return this.setDeliveryAddressCommandToCart.execute({address, cartId, userId});
  }

  getDeliveryAddressStateForCart(cartId: string, userId: string): Observable<Address | undefined> {
    return this.checkoutQueryFacade.getCheckoutDetailsStateForCart(cartId, userId).pipe(
      map((state) => ({
        ...state.deliveryAddress
      }))
    );
  }
}
