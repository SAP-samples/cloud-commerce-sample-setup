// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService, GlobalMessageService, TranslationService, User, UserPaymentService } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { LoaderState } from '@spartacus/core/src/state/utils/loader';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';
import {
  DeliveryModeConfig,
  TmaCart,
  TmaCheckoutPaymentService,
  TmaMultiCartService,
  TmaOrder,
  TmaOrderEntry,
  TmfProduct
} from '../../../../../../../core/';
import { PaymentDetails } from '@spartacus/core';
import { CheckoutQueryResetEvent } from '@spartacus/checkout/base/root';
import { FocusConfig, LaunchDialogService } from '@spartacus/storefront';
import { TmaOrderService } from '../../../../../../../core/order/facade';

@Component({
  selector: 'cx-termination-confirm',
  templateUrl: './termination-confirm.component.html',
  styleUrls: ['./termination-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TerminationConfirmComponent implements OnInit, OnDestroy {
  cart: TmaCart;
  subscribedProducts: TmfProduct[];
  user: User;
  state: LoaderState<void>;
  paymentId: string;
  protected subscription = new Subscription();

  focusConfig: FocusConfig = {
    trap: true,
    block: true,
    autofocus: 'button',
    focusOnEscape: true,
  };

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected userAccountFacade: UserAccountFacade,
    protected multiCartService: TmaMultiCartService,
    protected orderFacade: TmaOrderService,
    protected config: DeliveryModeConfig,
    protected globalMessageService: GlobalMessageService,
    protected translation: TranslationService,
    protected router: Router,
    protected checkoutPaymentService: TmaCheckoutPaymentService,
    private userPaymentService: UserPaymentService,
    protected eventService: EventService,
    protected spinner?: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data !== undefined) {
          this.cart = data.cart;
          this.subscribedProducts = data.subscribedProducts;
          this.state = data.state;
        }
      })
    );
    this.subscription.add(
      this.userAccountFacade
        .get()
        .subscribe((customer: User) => (this.user = customer))
    );
    this.subscription.add(
      this.multiCartService
        .getCart(this.cart.code)
        .subscribe((currentCart: TmaCart) => (this.cart = currentCart))
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  closeModal() {
    this.eventService.dispatch({}, CheckoutQueryResetEvent);
    this.multiCartService.deleteCart(this.cart.code, this.user.uid);
    this.launchDialogService.closeDialog('close termination confirm component');
  }

  /**
   * Retrieves the subscribed product from the order entry.
   *
   * @param entry The order entry of {@ link TmaOrderEntry}
   * @return The product as {@link TmfProduct}
   */
  getEntryProduct(entry: TmaOrderEntry): TmfProduct {
    return this.subscribedProducts.find(
      (subscribedProduct: TmfProduct) =>
        entry.subscribedProduct.id === subscribedProduct.id
    );
  }

  /**
   * Creates the dummy payment details used for one click order for termination flow.
   *
   */
  createPaymentDetails() {
    this.spinner.show();
    const paymentDetails: PaymentDetails = {
      accountHolderName: 'notapplicable',
      billingAddress: {
        country: {
          isocode: 'US',
          name: 'UnitedStates'
        },
        firstName: 'N/A',
        lastName: 'N/A',
        line1: 'N/A',
        postalCode: '08088',
        region: {
          countryIso: 'US',
          isocode: 'US-AL',
          name: 'Alabama',
          isocodeShort: 'AL'
        },
        shippingAddress: false,
        titleCode: 'dr',
        town: 'N/A'
      },
      cardNumber: '4111111111111111',
      cardType: {
        code: 'visa'
      },
      expiryMonth: '02',
      expiryYear: '2050',
      saved: false,
      defaultPayment: false,
      cvn: '221'
    };
    this.checkoutPaymentService.createPaymentDetailsFor(this.cart.code, paymentDetails).subscribe({
      complete: () => this.placeOrder()
    });
  }

  /**
   * Places an order and once an order is placed successfully
   * then it redirects to order details page.
   *
   */
  placeOrder(): void {
    this.subscription.add(
      this.checkoutPaymentService
        .getPaymentDetailsStateForCart(this.cart.code, this.user.uid)
        .pipe(
          take(1),
          map((state) => {
            if (state.accountHolderName) {
              this.paymentId = state.id;
              this.orderFacade.placeOrderFor(this.cart.code, false);
            }
          })
        )
        .subscribe()
    );

    this.subscription.add(
      this.orderFacade
        .getOrderDetails()
        .pipe(
          take(2),
          filter((orderPlaced: TmaOrder) => !!orderPlaced),
          distinctUntilChanged()
        )
        .subscribe((orderPlaced: TmaOrder) => {
          if (orderPlaced.code) {
            this.spinner.hide();
            this.launchDialogService.closeDialog('close termination confirm component');
            this.userPaymentService.deletePaymentMethod(this.paymentId);
            this.eventService.dispatch({}, CheckoutQueryResetEvent);
            this.router.navigate([`/my-account/order/${orderPlaced.code}`]);
          }
        })
    );
  }
}
