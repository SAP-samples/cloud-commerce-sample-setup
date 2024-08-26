// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { OrderConnector, OrderService } from '@spartacus/order/core';
import { Order, OrderPlacedEvent } from '@spartacus/order/root';
import { Command, CommandService, CommandStrategy, EventService, OCC_USER_ID_ANONYMOUS, UserIdService } from '@spartacus/core';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { combineLatest, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmaOrderService extends OrderService {

  protected placeOrderCommandFor: Command<{cartId: string; termsChecked: boolean}, Order> =
    this.commandService.create<{cartId: string; termsChecked: boolean}, Order>(
      (payload) =>
        this.checkoutPreconditionsCustom().pipe(
          switchMap(([userId]) =>
            this.orderConnector.placeOrder(userId, payload.cartId, payload.termsChecked).pipe(
              tap((order) => {
                const cartId = payload.cartId;
                this.placedOrder$.next(order);
                this.eventService.dispatch(
                  {
                    userId,
                    cartId,
                    /**
                     * As we know the cart is not anonymous (precondition checked),
                     * we can safely use the cartId, which is actually the cart.code.
                     */
                    cartCode: cartId,
                    order,
                  },
                  OrderPlacedEvent
                );
              })
            )
          )
        ),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  constructor(
    protected activeCartFacade: ActiveCartFacade,
    protected userIdService: UserIdService,
    protected commandService: CommandService,
    protected orderConnector: OrderConnector,
    protected eventService: EventService
  ) {
    super(activeCartFacade, userIdService, commandService, orderConnector, eventService);
  }

  protected checkoutPreconditionsCustom(): Observable<[string]> {
    return combineLatest([
      this.userIdService.takeUserId(),
      this.activeCartFacade.isGuestCart(),
    ]).pipe(
      take(1),
      map(([userId, isGuestCart]) => {
        if (
          !userId ||
          (userId === OCC_USER_ID_ANONYMOUS && !isGuestCart)
        ) {
          throw new Error('Checkout conditions not met');
        }
        return [userId];
      })
    );
  }

  placeOrderFor(cartId: string, termsChecked: boolean): Observable<Order> {
    return this.placeOrderCommandFor.execute({ cartId, termsChecked });
  }
}
