// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutPaymentConnector, CheckoutPaymentService } from '@spartacus/checkout/base/core';
import { combineLatest, Observable } from 'rxjs';
import {
  Command,
  CommandService,
  CommandStrategy,
  EventService,
  OCC_USER_ID_ANONYMOUS,
  PaymentDetails,
  QueryService,
  User,
  UserIdService
} from '@spartacus/core';
import { CheckoutPaymentDetailsCreatedEvent } from '@spartacus/checkout/base/root';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { TmaCheckoutQueryService } from './tma-checkout-query.service';

@Injectable({
  providedIn: 'root'
})
export class TmaCheckoutPaymentService extends CheckoutPaymentService {

  protected createPaymentMethodToCartCommand: Command<{ cartId: string; paymentDetails: PaymentDetails }, unknown> =
    this.commandService.create<{ cartId: string; paymentDetails: PaymentDetails }>(
      (payload) =>

        this.paymentMethodPreConditions().pipe(
          switchMap(([userId]) =>
            this.checkoutPaymentConnector
              .createPaymentDetails(userId, payload.cartId, payload.paymentDetails)
              .pipe(
                tap((response) => {
                  const cartId = payload.cartId;
                  this.eventService.dispatch(
                    { userId, cartId, paymentDetails: response },
                    CheckoutPaymentDetailsCreatedEvent
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
    protected queryService: QueryService,
    protected commandService: CommandService,
    protected eventService: EventService,
    protected checkoutPaymentConnector: CheckoutPaymentConnector,
    protected checkoutQueryFacade: TmaCheckoutQueryService,
    protected userAccountFacade: UserAccountFacade
  ) {
    super(activeCartFacade, userIdService, queryService, commandService, eventService, checkoutPaymentConnector, checkoutQueryFacade);
  }

  protected paymentMethodPreConditions(): Observable<[string, User]> {
    return combineLatest([
      this.userIdService.takeUserId(),
      this.activeCartFacade.isGuestCart(),
      this.userAccountFacade.get()
    ]).pipe(
      take(1),
      map(([userId, isGuestCart, userDetails]) => {
        if (
          !userId ||
          (userId === OCC_USER_ID_ANONYMOUS && !isGuestCart)
        ) {
          throw new Error('Checkout conditions not met');
        }
        return [userId, userDetails];
      })
    );
  }

  /**
   * Sets the given payment id on the cart of the user.
   *
   * @param paymentId a payment method ID
   */
  setPaymentDetailsFor(paymentId: string): void {
    const paymentDetails = {
      id: paymentId
    };
    this.setPaymentDetails(paymentDetails);
  }

  /**
   * Create payment details and assign it to cart of the user.
   *
   * @param cartId
   * @param paymentDetails
   */
  createPaymentDetailsFor(
    cartId: string,
    paymentDetails: PaymentDetails
  ): Observable<unknown> {
    return this.createPaymentMethodToCartCommand.execute({cartId, paymentDetails});
  }

  getPaymentDetailsStateForCart(cartId: string, userId: string): Observable<PaymentDetails | undefined> {
    return this.checkoutQueryFacade.getCheckoutDetailsStateForCart(cartId, userId).pipe(
      map((state) => ({
        ...state.paymentInfo
      }))
    );
  }
}
