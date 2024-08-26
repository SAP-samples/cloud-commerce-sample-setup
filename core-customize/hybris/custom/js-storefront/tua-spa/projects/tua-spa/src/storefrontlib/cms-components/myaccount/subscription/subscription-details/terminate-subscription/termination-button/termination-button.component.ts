// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import {
  Address,
  BaseSiteService,
  GlobalMessageService,
  GlobalMessageType,
  QueryState,
  TranslationService,
  User,
  UserAddressService
} from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take, tap } from 'rxjs/operators';
import {
  DeliveryModeConfig,
  TmaCheckoutDeliveryAddressService,
  TmaCheckoutDeliveryModesService,
  TmaMultiCartFacade,
  TmaTmfCartService
} from '../../../../../../../core/';
import {
  TmaActionType,
  TmaAddress,
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmfProduct
} from '../../../../../../../core/model';
import { Cart, DeliveryMode } from '@spartacus/cart/base/root';

@Component({
  selector: 'cx-termination-button',
  templateUrl: './termination-button.component.html'
})
export class TerminationButtonComponent implements OnInit, OnDestroy {
  @Input()
  product: TmfProduct;
  userAddresses: TmaAddress[];
  user: User;
  cart: TmaCart;
  baseSiteId: string;
  defaultAddress: TmaAddress;
  state:  DeliveryMode;
  protected subscription = new Subscription();

  constructor(
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected userAddressService: UserAddressService,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected userAccountFacade: UserAccountFacade,
    protected tmaMultiCartFacade: TmaMultiCartFacade,
    protected tmaTmfCartService: TmaTmfCartService,
    protected baseSiteService: BaseSiteService,
    protected translation: TranslationService,
    protected checkoutDeliveryService: TmaCheckoutDeliveryAddressService,
    protected checkoutDeliveryModeService: TmaCheckoutDeliveryModesService,
    protected config: DeliveryModeConfig
  ) {}

  ngOnInit(): void {
    this.userAddressService.loadAddresses();
    this.subscription.add(
      this.userAddressService
        .getAddresses()
        .subscribe((addresses: TmaAddress[]) => (this.userAddresses = addresses))
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  /**
   * Open the Termination process popup on click of terminate button on subscription details page.
   * During the termination process flow,following activites are performed:-
   * 1.)Creates an empty cart.
   * 2.)Add to cart with remove action entry of subscribed product.
   * 3.)Sets the default address.
   * 4.)Sets the default delivery mode.
   * If user does not have any default address , it will show global error message.
   */
  openTerminatePopup() {
    this.defaultAddress = this.userAddresses.find(
      (address: TmaAddress) => address.defaultAddress
    );
    if (this.defaultAddress) {
      this.subscription.add(
        this.userAccountFacade
          .get()
          .subscribe((customer: User) => (this.user = customer))
      );
      this.subscription.add(
        this.baseSiteService
          .getActive()
          .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );
      this.subscription.add(
        this.tmaMultiCartFacade
          .createCart({
            userId: this.user.uid
          })
          .pipe(
            take(1)
          )
          .subscribe((cart: Cart) => {
            if (cart) {
              this.cart = cart;
              this.addToCart();
            }
          })
      );
    } else {
      this.subscription.add(
        this.translationService
          .translate('subscriptions.deliveryAddressRequired')
          .pipe(
            tap((translatedMessage: string) =>
              this.globalMessageService.add(
                translatedMessage,
                GlobalMessageType.MSG_TYPE_ERROR
              )
            )
          )
          .subscribe()
      );
    }
  }

  protected addToCart(): void {
    const cartEntry: TmaOrderEntry = {
      action: TmaActionType.REMOVE,
      processType: {
        id: TmaProcessTypeEnum.TERMINATION
      },
      product: {
          code: ''
      },
      quantity: 1,
      subscribedProduct: {
        id: this.product.id
      }
    };
    this.tmaMultiCartFacade.addCartEntry(
      this.user.uid,
      this.cart.code,
      cartEntry
    );
    this.launchDialogService.closeDialog('close payment modal');
    const oldCart = this.cart;
    this.subscription.add(
      this.tmaMultiCartFacade
        .getCart(oldCart.code)
        .pipe(
          take(2),
          filter(
            (currentCart: TmaCart) =>
              currentCart &&
              currentCart.entries &&
              currentCart.entries.length >
                (oldCart && oldCart.entries ? oldCart.entries.length : 0)
          ),
          distinctUntilChanged()
        )
        .subscribe((currentCart: TmaCart) => {
          this.cart = currentCart;
          const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
            oldCart,
            currentCart
          );
          if (newlyAddedEntries) {
            this.setDefaultDeliveryAddress();
          }
        })
    );
  }

  /**
   * Sets the default delivery address with cart.
   * Once the delivery address association with cart is successful then default delivery mode is set.
   * If there is no address associated with an user then required delivery address message is present to an user.
   */
  protected setDefaultDeliveryAddress(): void {
    this.checkoutDeliveryService.setDeliveryAddressToCart(this.defaultAddress, this.cart.code, this.user.uid).subscribe( {
      complete: () => this.onSuccessDeliveryAddressSet(this.cart.code, this.user.uid)
    });
  }

  protected onSuccessDeliveryAddressSet(cartId: string, userId: string): void {
    this.subscription.add(
      this.checkoutDeliveryService
        .getDeliveryAddressStateForCart(cartId, userId)
        .pipe(
          take(1),
          distinctUntilChanged(),
          map((state: Address | undefined) => {
            if (state) {
              this.setDefaultDeliveryMode();
            } else if (!state) {
              this.checkoutDeliveryService.clearCheckoutDeliveryAddress();
              this.tmaMultiCartFacade.deleteCart(this.cart.code, this.user.uid);
              this.launchDialogService.closeDialog('close active modal');
              this.subscription.add(
                this.translation
                  .translate('subscriptions.deliveryAddressRequired')
                  .pipe(
                    tap((translatedMessage: string) =>
                      this.globalMessageService.add(
                        translatedMessage,
                        GlobalMessageType.MSG_TYPE_ERROR
                      )
                    )
                  )
                  .subscribe()
              );
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Sets the default delivery mode with cart.
   * Once the delivery mode association with cart is successfull then termination confirm pop up opens.
   */
  protected setDefaultDeliveryMode(): void {
    this.checkoutDeliveryModeService.setDeliveryModeToCart(this.cart.code, this.user.uid, this.config.deliveryMode.default_delivery_mode).subscribe({
      complete: () => this.onSuccessDeliveryModeSet(this.cart.code, this.user.uid)
    });
  }

  protected onSuccessDeliveryModeSet(cartId: string, userId: string): void {
    this.subscription.add(
      this.checkoutDeliveryModeService
        .getSelectedDeliveryModeStateForCart(cartId, userId)
        .pipe(
          take(1),
          distinctUntilChanged(),
          map((loaderState) => {
            this.state = loaderState;
            if (!loaderState) {
              this.checkoutDeliveryService.clearCheckoutDeliveryAddress();
              this.tmaMultiCartFacade.deleteCart(this.cart.code, this.user.uid);
              this.launchDialogService.closeDialog('close confirm termination popup');
              this.subscription.add(
                this.translation
                  .translate('subscriptions.deliveryModeNotEligible')
                  .pipe(
                    tap((translatedMessage: string) =>
                      this.globalMessageService.add(
                        translatedMessage,
                        GlobalMessageType.MSG_TYPE_ERROR
                      )
                    )
                  )
                  .subscribe()
              );
            } else if (loaderState) {
              const modalInstanceData = {
                cart: this.cart,
                subscribedProducts: [this.product],
                state: this.state
              };
              const dialog = this.launchDialogService.openDialog(
                LAUNCH_CALLER.TMA_TERMINATION_CONFIRM,
                undefined,
                this.vcr,
                modalInstanceData
              );
              if (dialog) {
                dialog.pipe(take(1)).subscribe();
              }
            }
          })
        )
        .subscribe()
    );
  }
}
