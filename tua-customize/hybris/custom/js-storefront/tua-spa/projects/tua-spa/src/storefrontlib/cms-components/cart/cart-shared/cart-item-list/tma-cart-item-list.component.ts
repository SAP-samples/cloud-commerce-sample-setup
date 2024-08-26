// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import {
  BaseSiteService,
  GlobalMessageService,
  GlobalMessageType,
  OCC_USER_ID_ANONYMOUS,
  ProductSearchPage,
  ProductSearchService,
  ProductService,
  RoutingService,
  TranslationService,
  User,
  UserIdService
} from '@spartacus/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  AppointmentService,
  LOCAL_STORAGE,
  LogicalResourceReservationService,
  LogicalResourceType,
  TmaActionType,
  TmaCart,
  TmaCartPrice,
  TmaCharacteristic,
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingStepsService,
  TmaMessage,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductService,
  TmaSelectionAction,
  TmaTmfCartService,
  TmaTmfShoppingCart,
  TmaValidationMessage,
  TmaValidationMessageType
} from '../../../../../core';
import { first, map, startWith, tap } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { UserAccountFacade } from '@spartacus/user/account/root';
import {
  ActiveCartFacade,
  CartItemComponentOptions,
  ConsignmentEntry,
  MultiCartFacade,
  PromotionLocation,
  SelectiveCartFacade
} from '@spartacus/cart/base/root';
import { CartItemListComponent } from '@spartacus/cart/base/components';
import { OutletContextData } from '@spartacus/storefront';

const { QUERY, FREE_TEXT, CODE } = LOCAL_STORAGE.SEARCH;

interface TmaGroupedItemMap {
  [key: number]: TmaOrderEntry;
}

interface ItemListContext {
  readonly?: boolean;
  hasHeader?: boolean;
  options?: CartItemComponentOptions;
  cartId?: string;
  items?: TmaOrderEntry[];
  promotionLocation?: PromotionLocation;
  cartIsLoading?: boolean;
}

@Component({
  selector: 'cx-cart-item-list',
  templateUrl: './tma-cart-item-list.component.html',
  styleUrls: ['./tma-cart-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartItemListComponent
  extends CartItemListComponent
  implements OnInit, OnDestroy {
  @Input()
  shouldReloadCart: boolean;

  @Input()
  showEdit?: boolean;

  @Input()
  enableChecklistActions?: boolean = true;

  @Input() readonly = false;

  @Input() hasHeader = true;

  @Input()
  isPremiseDetailsReadOnly: boolean;

  @Input() options: CartItemComponentOptions = {
    isSaveForLater: false,
    optionalBtn: null
  };

  @Input() promotionLocation: PromotionLocation = PromotionLocation.ActiveCart;

  @Input('items')
  set items(items: TmaOrderEntry[]) {
    this.resolveTmaItems(items);
    this.createTmaForm();
  }

  get items(): TmaOrderEntry[] {
    return this._tmaItems;
  }

  @Input('cartIsLoading') set setLoading(value: boolean) {
    if (!this.readonly) {
      value
        ? this.form.disable({ emitEvent: false })
        : this.form.enable({ emitEvent: false });
    }
  }

  form: FormGroup;
  groupedItems: TmaGroupedItemMap[];
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected currentCart: TmaCart;
  protected subscriptions = new Subscription();
  private _tmaItems: TmaOrderEntry[] = [];

  constructor(
    protected activeCartService: ActiveCartFacade,
    protected selectiveCartService: SelectiveCartFacade,
    protected userIdService: UserIdService,
    protected multiCartService: MultiCartFacade,
    protected cd: ChangeDetectorRef,
    protected fb: FormBuilder,
    protected productService: ProductService,
    protected productSearchService: ProductSearchService,
    protected baseSiteService: BaseSiteService,
    protected userAccountFacade: UserAccountFacade,
    protected tmfCartService: TmaTmfCartService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected routingService: RoutingService,
    protected translationService?: TranslationService,
    protected globalMessageService?: GlobalMessageService,
    protected appointmentService?: AppointmentService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected tmaProductService?: TmaProductService,

    @Optional() protected outlet?: OutletContextData<ItemListContext>
  ) {
    super(activeCartService, selectiveCartService, userIdService, multiCartService, cd);
    this.subscriptions.add(
      this.activeCartService
        .getActive()
        .subscribe((cart: TmaCart) => (this.currentCart = cart))
    );
    this.subscriptions.add(
      this.activeCartService
        .getEntries()
        .subscribe((entries: TmaOrderEntry[]) => {
          this.items = this.resolveItemList(entries, []);
          this.groupedItems = this.tmfCartService.getGroupedItems(entries);
        })
    );
  }

  ngOnInit(): void {
    this.loadReservationsForCartEntries();

    this.subscriptions.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => !!user)
        )
        .subscribe((user: User) => (this.currentUser = user))
    );

    this.subscriptions.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
    );

    this.groupedItems = this.tmfCartService.getGroupedItems(this.items);
    this.items = this.resolveItemList(this.items, []);

    if (!this.shouldReloadCart) {
      return;
    }
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.logicalResourceReservationService.clearReservationState();
    this.subscriptions?.unsubscribe();
  }

  /**
   * Returns the product for the provided code.
   *
   * @param code - The identifier of the product
   */
  getProduct(code: string): Observable<TmaProduct> {
    return this.productService.get(code);
  }

  /**
   * Removes a bundled product offering from cart.
   *
   * @param entryGroupNumber - The entry group number of the bundled product offering
   */
  removeBpo(entryGroupNumber: number): void {
    this.guidedSellingStepsService.setFirstStepAsActiveStep();

    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: this.currentCart.code,
      guid:
        currentUserId === OCC_USER_ID_ANONYMOUS ? this.currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      relatedParty: [
        {
          id: currentUserId
        }
      ],
      cartItem: [
        {
          id: entryGroupNumber.toString(),
          quantity: 0
        }
      ]
    };

    this.tmfCartService.updateCart(shoppingCart);
  }

  /**
   * Returns compatibility errors for the provided entry group number.
   *
   * @param entryGroupNumber - The entry group number
   * @return List of {@link TmaValidationMessage}
   */
  getCompatibilityErrorsForEntryGroup(
    entryGroupNumber: number
  ): TmaValidationMessage[] {
    let entry: TmaOrderEntry;
    if (this.currentCart && this.currentCart.entries) {
      this.currentCart.entries.forEach((tmaEntry: TmaOrderEntry) => {
        if (tmaEntry.entryNumber === Number(entryGroupNumber)) {
          entry = tmaEntry;
        }
      });
    }
    return this.getCompatibilityErrorsForEntry(entry);
  }

  /**
   * Returns compatibility errors for cart.
   *
   * @return List of {@link TmaMessage}
   */
  getCompatibilityErrorsForCart(): TmaMessage[] {
    if (this.currentCart.message) {
      return this.currentCart.message.filter((message: TmaMessage) =>
        message &&
        message.type === TmaValidationMessageType.COMPATIBILITY);
    }
    return [];
  }

  /**
   * Prepares CGS page with necessary information for edit and redirects to CGS page when information is loaded.
   *
   * @param entryGroupNumber - The group number of the entries
   * @param items - The items part of the entry group
   * @param index - The index of the item currently being processed
   */
  prepareCgsForEdit(
    entryGroupNumber: number,
    items: TmaOrderEntry[],
    index: number
  ): void {

    if (index === 0) {
      this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    }

    if (!items || items.length <= index) {
      this.removeBpo(entryGroupNumber);
      this.redirectToCgsPage(items[0].rootBpoCode, items);

      this.cancelAppointment(items);
      return;
    }

    if (items[index].entries) {
      this.prepareCgsForEdit(entryGroupNumber, items, index + 1);
      return;
    }

    this.productSearchService.search(
      QUERY + FREE_TEXT + CODE + items[index].product.code,
      { pageSize: 1 }
    );
    this.subscriptions.add(
      this.productSearchService
        .getResults()
        .pipe(
          first((productSearchPage: ProductSearchPage) => {
            return (
              productSearchPage &&
              productSearchPage.products &&
              productSearchPage.products.length !== 0 &&
              !!productSearchPage.products.find(
                (product: TmaProduct) =>
                  product.code === items[index].product.code
              )
            );
          })
        )
        .subscribe((productSearchPage: ProductSearchPage) => {
            this.guidedSellingCurrentSelectionsService.changeSelection(
              productSearchPage.products.find(
                (product: TmaProduct) =>
                  product.code === items[index].product.code
              ),
              TmaSelectionAction.ADD
            );
          this.prepareCgsForEdit(entryGroupNumber, items, index + 1);
        })
    );
  }

  getControl(item: TmaOrderEntry): Observable<FormGroup> {
    return this.form.get(item.entryNumber.toString()).valueChanges.pipe(
      // tslint:disable-next-line:deprecation
      startWith(null),
      map((value: any) => {
        if (value && this.selectiveCartService && this.options.isSaveForLater) {
          this.selectiveCartService.updateEntry(
            value.entryNumber,
            value.quantity
          );
        }
        else if (value) {
          this.activeCartService.updateEntry(value.entryNumber, value.quantity);
        }
      }),
      map(() => <FormGroup>this.form.get(item.entryNumber.toString()))
    );
  }

  /**
   * Checks if the given cart entries have renewal process type.
   *
   * @param items - The cart items
   *
   * @return true if cart item has process type as renewal as a {@link boolean}
   */
  isCartEntryForRenewal(items: TmaOrderEntry[]): boolean {
    const renewItem = items.find(
      (item: TmaOrderEntry) =>
        item.processType !== undefined &&
        item.processType.id === TmaProcessTypeEnum.RENEWAL
    );
    return renewItem !== undefined;
  }

  getOrderEntryArray(item: TmaOrderEntry): TmaOrderEntry[] {
    return Array.of(item);
  }

  isFixedPricedBpo(bpoCode: string): TmaCartPrice{

    return this.items.find((entry: TmaOrderEntry) =>
      entry.product.code === bpoCode)?.cartPrice;
  }

  protected resolveItemList(items: TmaOrderEntry[], resolvedItems: TmaOrderEntry[]): TmaOrderEntry[] {

    items.forEach((item: TmaOrderEntry) => {
      resolvedItems.push(item);
      if (item.entries) {
        this.resolveItemList(item.entries, resolvedItems);
      }
    });

    return resolvedItems;
  }

  protected cancelAppointment(items: TmaOrderEntry[]): void {
    const appointmentItem: TmaOrderEntry = items.find(
      (item: TmaOrderEntry) => item.appointment !== undefined
    );
    if (appointmentItem) {
      this.appointmentService.cancelAppointment(appointmentItem.appointment.id);
      this.translationService
        .translate('guidedSelling.edit.previousAppointmentDeleted')
        .pipe(
          tap((translatedMessage: string) =>
            this.globalMessageService.add(
              translatedMessage,
              GlobalMessageType.MSG_TYPE_ERROR
            )
          )
        )
        .subscribe()
        .unsubscribe();
    }
  }

  protected hasRootGroups(cart: TmaCart): boolean {
    return cart && cart.rootGroups && cart.rootGroups.length !== 0;
  }

  protected redirectToCgsPage(bpoCode: string, items: TmaOrderEntry[]): void {
    items.find((item: TmaOrderEntry) => item.action && item.action.toString() === TmaActionType.KEEP) ?
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode, process: TmaProcessTypeEnum.RETENTION } }) :
    this.routingService.go({ cxRoute: 'cgs', params: { code: bpoCode, process: '' } });
    this.guidedSellingCurrentSelectionsService.validateCurrentSelection$.next(true);
  }

  /**
   * This method loads the reservation if any MSISDN is associated with cart entry
   *
   **/
  protected loadReservationsForCartEntries(): void {
    const cartEntryMsisdns = [];
    if (!this.items) {
      return;
    }
    this.items.forEach((item: TmaOrderEntry) => {
      this.flattenCartItems(item, cartEntryMsisdns);
    });
    if (cartEntryMsisdns.length) {
      this.logicalResourceReservationService.loadReservationByUserIdAndResource(
        cartEntryMsisdns
      );
    }
  }

  protected flattenCartItems(item: TmaOrderEntry, cartEntryMsisdns) {
    if (item.entries?.length) {
      item.entries.forEach((childItem: TmaOrderEntry) => {
        this.flattenCartItems(childItem, cartEntryMsisdns);
      })
    }
    if (!!item.subscribedProduct && !!item.subscribedProduct.characteristic) {
      item.subscribedProduct.characteristic.forEach(
        (logicalResource: TmaCharacteristic) => {
          if (
            logicalResource.value !== null &&
            logicalResource.name === LogicalResourceType.MSISDN
          ) {
            cartEntryMsisdns.push(logicalResource.value);
          }
        }
      );
    }
  }

  protected getCompatibilityErrorsForEntry(entry: TmaOrderEntry): TmaValidationMessage[] {
    const validationMessage: TmaValidationMessage[] = [];
    if (entry && entry.entries) {
      entry.entries.forEach((tmaEntry: TmaOrderEntry) => {
        validationMessage.push(...this.getCompatibilityErrorsForEntry(tmaEntry));
      });
    }
    if (entry && entry.validationMessages) {
      let validationMessages: TmaValidationMessage[] = [];
      validationMessages = entry.validationMessages.filter((message: TmaValidationMessage) =>
        message &&
        message.code === TmaValidationMessageType.COMPATIBILITY
      );
      validationMessage.push(...validationMessages);
    }
    return validationMessage;
  }

  /**
   * @param items The items we're getting form the input do not have a consistent model.
   * In case of a `consignmentEntry`, we need to normalize the data from the orderEntry.
   */
  private resolveTmaItems(items: TmaOrderEntry[]): void {
    if (items.every((item: TmaOrderEntry) => item.hasOwnProperty('orderEntry'))) {
      this._tmaItems = items.map((consignmentEntry: TmaOrderEntry) => {
        const entry = Object.assign(
          {},
          (consignmentEntry as ConsignmentEntry).orderEntry
        );
        entry.quantity = consignmentEntry.quantity;
        return entry;
      });
    }
    else {
      this._tmaItems = items;
    }
  }

  private createTmaForm(): void {
    this.form = new FormGroup({});
    this.resolveItemList(this._tmaItems, []).forEach((item: TmaOrderEntry) => {
      const entryNumber = item.entryNumber.toString();
      const group = new FormGroup({
        entryNumber: new FormControl((<any>item).entryNumber),
        quantity: new FormControl(item.quantity, { updateOn: 'blur' })
      });
      if (!item.updateable || this.readonly) {
        group.disable();
      }
      this.form.addControl(entryNumber, group);
    });
  }
}
