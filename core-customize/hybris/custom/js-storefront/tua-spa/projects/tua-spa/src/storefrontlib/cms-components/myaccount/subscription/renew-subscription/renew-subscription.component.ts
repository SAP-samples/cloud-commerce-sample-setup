// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  RecommendationService,
  SubscriptionTermService,
  TmaActiveCartFacade,
  TmaCart,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaSubscriptionTerm,
  TmaTmfActionType,
  TmaTmfCartService,
  TmaTmfShoppingCart,
  TmfProduct
} from '../../../../../core';
import { BaseSiteService, EventService, OCC_USER_ID_ANONYMOUS, User } from '@spartacus/core';
import { Observable, of, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { CartUiEventAddToCart } from '@spartacus/cart/base/root';

@Component({
  selector: 'cx-renew-subscription',
  templateUrl: './renew-subscription.component.html',
  styleUrls: ['./renew-subscription.component.scss']
})
export class RenewSubscriptionComponent implements OnInit, OnDestroy {
  @Input()
  subscription: TmfProduct;
  @Input()
  subscribedProducts: TmfProduct[];
  @Input()
  buttonText: string;

  baseSiteId: string;
  user: User;
  currentCart$: Observable<TmaCart>;
  parentBpo: TmaProduct;
  increment: boolean;
  productCodes: string[] = [];
  protected subscriptions = new Subscription();;

  constructor(
    public subscriptionTermService: SubscriptionTermService,
    protected userAccountFacade: UserAccountFacade,
    protected baseSiteService: BaseSiteService,
    protected recommendationService: RecommendationService,
    protected activeCartService: TmaActiveCartFacade,
    protected tmaTmfCartService: TmaTmfCartService,
    protected spinner: NgxSpinnerService,
    protected eventService: EventService
  ) {}

  ngOnInit(): void {
    this.currentCart$ = this.activeCartService.getActive();
    this.subscriptions.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );
    this.subscriptions.add(
      this.userAccountFacade
        .get()
        .subscribe((customer: User) => (this.user = customer))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions?.unsubscribe();
    this.recommendationService.clearRecommendationState();
  }

  /**
   * Adding the product to cart for renew
   *
   * @param currentCart - cart with subscribed products for renew
   * @param subscriptionTerm - subscription term
   */
  addToCartForRenewal(
    currentCart: TmaCart,
    subscriptionTerm: TmaSubscriptionTerm
  ): void {
    if (!this.subscription.isBundle) {
      this.addToCartSpoRenewal(currentCart, subscriptionTerm);
    }
  }

  protected addToCartSpoRenewal(
    currentCart: TmaCart,
    subscriptionTerm: TmaSubscriptionTerm
  ): void {
    const currentUserId: string =
      this.user && this.user.uid ? this.user.uid : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.baseSiteId,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.RENEWAL
          },
          action: TmaTmfActionType.KEEP,
          product: {
            id: this.subscribedProducts[0].id
          },
          quantity: 1,
          itemTerm: [subscriptionTerm]
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.addToCart(shoppingCart, currentCart);
  }

  protected getNewlyAddedEntries(
    oldCart: TmaCart,
    newCart: TmaCart
  ): TmaOrderEntry[] {
    const entriesWithLastAdded: number[] = [];
    const entriesWithoutLastAdded: number[] = [];
    newCart.entries.forEach((entry: TmaOrderEntry) =>
      entriesWithLastAdded.push(entry.entryNumber)
    );

    if (oldCart.entries) {
      oldCart.entries.forEach((entry: TmaOrderEntry) =>
        entriesWithoutLastAdded.push(entry.entryNumber)
      );
    }

    const newlyAddedEntryIds: number[] = entriesWithLastAdded.filter(
      (entryNumber: number) => entriesWithoutLastAdded.indexOf(entryNumber) < 0
    );

    const newlyAddedEntries: TmaOrderEntry[] = [];
    newlyAddedEntryIds.forEach((entryNumber: number) =>
      newlyAddedEntries.push(
        newCart.entries.find(
          (entry: TmaOrderEntry) => entry.entryNumber === entryNumber
        )
      )
    );

    return newlyAddedEntries;
  }

  protected addToCart(
    shoppingCart: TmaTmfShoppingCart,
    currentCart: TmaCart
  ): void {
    this.tmaTmfCartService.updateCart(shoppingCart);
    this.spinner.show();
    this.subscriptions.add(
      this.activeCartService
        .getActive()
        .pipe(
          first(
            (cart: TmaCart) =>
              cart &&
              cart.entries &&
              cart.entries.length >
                (currentCart && currentCart.entries
                  ? currentCart.entries.length
                  : 0)
          )
        )
        .subscribe((newCart: TmaCart) => {
          const newlyAddedEntries: TmaOrderEntry[] = this.tmaTmfCartService.getNewlyAddedEntries(
            currentCart,
            newCart
          );
          if (newlyAddedEntries) {
            this.spinner.hide();
            this.increment = newlyAddedEntries[0].quantity > 1;
            this.openAddToCartModal(of(newlyAddedEntries[0]));
          }
        })
    );
  }

  protected createCartUiEventAddToCart(
    productCode: string,
    quantity: number,
    numberOfEntriesBeforeAdd: number
  ) {
    const newEvent = new CartUiEventAddToCart();
    newEvent.productCode = productCode;
    newEvent.quantity = quantity;
    newEvent.numberOfEntriesBeforeAdd = numberOfEntriesBeforeAdd;
    return newEvent;
  }

  protected openAddToCartModal(entry$: Observable<TmaOrderEntry>): void {
    this.subscriptions.add(
      entry$.subscribe((newEntry: TmaOrderEntry) => {
        this.eventService.dispatch(
          this.createCartUiEventAddToCart(
            newEntry.product.code,
            1,
            newEntry.quantity
          )
        );
      })
    );
  }
}
