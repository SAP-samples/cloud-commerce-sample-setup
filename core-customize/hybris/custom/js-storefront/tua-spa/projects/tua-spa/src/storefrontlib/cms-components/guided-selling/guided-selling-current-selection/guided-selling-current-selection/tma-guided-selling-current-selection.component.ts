// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  QualificationBundle,
  TmaCart,
  TmaChecklistAction,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductOfferingGroup,
  TmaProductOfferingPrice,
  TmaProductOfferingQualification,
  TmaProductOfferingQualificationItem,
  TmaSelectionAction,
  TmaTmfActionType,
  TmaTmfCartItem,
  TmaTmfShoppingCart,
  TmfProduct
} from '../../../../../core/model';
import { Observable, Subscriber, Subscription } from 'rxjs';
import {
  TmaGuidedSellingCurrentSelectionsService,
  TmaGuidedSellingProductConfigSelectionsService,
  TmaGuidedSellingStepsService
} from '../../../../../core/guided-selling/facade';
import { TmaPriceService } from '../../../../../core/product/facade';
import {
  BaseSiteService,
  OCC_USER_ID_ANONYMOUS,
  Product,
  ProductService,
  User
} from '@spartacus/core';
import { distinctUntilChanged, filter, first, map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE, TmaConstantResourceModel } from '../../../../../core/util/constants';
import {
  JourneyChecklistConfig,
  TmaActiveCartFacade,
  TmaChecklistActionService,
  TmaTmfCartService,
  TmfProductMap, CheckProductOfferingQualificationService, ProductOfferingService
} from '../../../../../core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';

const { GUIDED_SELLING, CHECKLIST_ACTION } = LOCAL_STORAGE;

@Component({
  selector: 'cx-guided-selling-current-selection',
  templateUrl: './tma-guided-selling-current-selection.component.html',
  styleUrls: ['./tma-guided-selling-current-selection.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('false', style({height: '0', overflow: 'hidden'})),
      state('true', style({height: '*', overflow: 'hidden'})),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ])
  ]
})

export class TmaGuidedSellingCurrentSelectionComponent
  implements OnInit, OnDestroy {
  @ViewChild('addToCartButton', {static: false})
  addToCartButton: ElementRef;

  @Input()
  product: Product;

  @Input()
  subscriptionDetail: TmfProductMap;

  @Input()
  tmfProducts: TmfProduct[];

  @Input()
  isSubscription = false;

  currentSelections: TmaProduct[];
  currentSelectionTotal: string;
  parentBpo: TmaProduct;
  qualificationErrorMessages;
  qualificationSuccessMessage = false;
  showQualificationErrorMessages = false;
  selectedProductOfferings = [];

  currentCart$: Observable<TmaCart>;
  priceValue: TmaProductOfferingPrice[];
  discount: number;

  protected isCurrentSelectionExpanded: boolean;
  protected bpoCode: string;
  protected currentUser: User;
  protected currentBaseSiteId: string;

  protected subscription = new Subscription();


  constructor(
    protected activatedRoute: ActivatedRoute,
    protected userAccountFacade: UserAccountFacade,
    protected baseSiteService: BaseSiteService,
    protected activeCartService: TmaActiveCartFacade,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected guidedSellingProductConfigSelectionsService: TmaGuidedSellingProductConfigSelectionsService,
    protected priceService: TmaPriceService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected productService: ProductService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected productOfferingService: ProductOfferingService,
    protected cd: ChangeDetectorRef,
    protected checkProductOfferingQualificationService?: CheckProductOfferingQualificationService,
    protected config?: JourneyChecklistConfig,
    private spinner?: NgxSpinnerService
  ) {
    this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
    this.currentSelectionTotal = GUIDED_SELLING.CURRENT_SELECTION.DASH;
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }

  ngOnInit(): void {
    this.bpoCode = this.activatedRoute.snapshot.url[1].toString();
    this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections = true;

    this.currentCart$ = this.activeCartService.getActive();

    this.subscription.add(
      this.productService
        .get(this.bpoCode)
        .pipe(
          first((product: TmaProduct) => product != null)
        )
        .subscribe((product: TmaProduct) => (this.parentBpo = product))
    );

    this.subscription.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null)
        )
        .subscribe((user: User) => (this.currentUser = user))
    );

    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
    );

    this.subscription.add(
      this.guidedSellingCurrentSelectionsService.selection$
        .subscribe((qualificationBundle: QualificationBundle) => {
          this.validateSelectionWithQualification(qualificationBundle);
        })
    );

    this.subscription.add(
      this.guidedSellingCurrentSelectionsService.validateCurrentSelection$
        .pipe(
          filter((res) => res !== false)
        ).subscribe((res: boolean) => {
        this.validateSelectionWithQualification({qualificationBundleCheck: res});
      })
    );
  }

  validateSelectionWithQualification(qualificationBundle: QualificationBundle) {
    this.selectedProductOfferings = [];
    const bpoCode = this.activatedRoute.snapshot.url[1].toString();
    const payload = {
      id: bpoCode,
      productOfferingQualificationItem: []
    };
    const productOfferingQualificationItem = [
      {
        id: "1",
        action: "add",
        productOffering: {
          id: bpoCode
        }
      }
    ];
    this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
    if (this.currentSelections.length && qualificationBundle.qualificationBundleCheck) {
      this.currentSelections.forEach((product: TmaProduct, index) => {
        const getCurrentSelectionProductBpoCode = product.parents.filter((parentBpo) => this.guidedSellingStepsService.guidedSellingBpoList.includes(parentBpo.code))[0]?.code;
        this.getProductOfferingGroupQuadPlay(getCurrentSelectionProductBpoCode, product.code);
        this.productOfferingService.selectedProductOfferings$.next(this.selectedProductOfferings);
        let payload = {
          id: (index + 2).toString(),
          action: "add",
          qualificationItemRelationship: [{
            id: '1',
            relationshipType: "bundles"
          }],
          productOffering: {
            id: product.code
          },
          product: {
          }
        };
        if (product.productSpecification?.id) 
        {
          payload.product = {
            productSpecification: {
              id: product.productSpecification?.id
            }
          }
        };

        productOfferingQualificationItem.push(payload);
      });
      payload.productOfferingQualificationItem = productOfferingQualificationItem;
    } else {
      this.productOfferingService.selectedProductOfferings$.next(this.selectedProductOfferings);
    }
    if (payload.productOfferingQualificationItem.length > 1) {
      this.subscription.add(
        this.checkProductOfferingQualificationService.checkProductOfferingQualification(payload)
          .subscribe((res: TmaProductOfferingQualification[]) => {
            if (res === undefined) {
              return;
            }

            if (res.length) {
              let foundEligibilityUnavailabilityReason = false;
              res.forEach((qualificationMessage: TmaProductOfferingQualificationItem) => {
                const notAllEligibilityUnavailabilityReasonsAreChecklistActions: boolean = qualificationMessage.eligibilityUnavailabilityReason.some((reason) => {
                  return reason.code !== CHECKLIST_ACTION.TEXT;
                });

                if (notAllEligibilityUnavailabilityReasonsAreChecklistActions) {
                  this.qualificationErrorMessages = qualificationMessage.eligibilityUnavailabilityReason;
                  foundEligibilityUnavailabilityReason = true;
                  return;
                }
              });

              if (foundEligibilityUnavailabilityReason) {
                return;
              }
            }

            this.qualificationSuccessMessage = true;
            this.qualificationErrorMessages = [];

            this.cd.detectChanges();
          })
      );
    }
    this.currentSelectionTotal = this.calculateTotal(
      this.currentSelections
    );
  }

  /**
   * Populates the current selected products productOfferingGroup id's in list
   *
   * @param bpoCode - The identifier of the BPO
   * @param selectedProductCode - The identifier of the selected productOfferingsGroup
   */

  getProductOfferingGroupQuadPlay(bpoCode: string, selectedProductCode: string) {
    this.subscription.add(
      this.productService.get(bpoCode).subscribe((result: TmaProduct) => {
        if (result) {
          let childExistingInOffer;
          result.offeringGroup.forEach((offer: TmaProductOfferingGroup) => {
            childExistingInOffer = offer.childProductOfferings.find((child: TmaProduct) => child.code === selectedProductCode);
            if (offer.childProductOfferings.find((child: TmaProduct) => child.code === selectedProductCode)) {
              this.selectedProductOfferings.push(offer.id);
            }
          });
          if (!childExistingInOffer) {
            result.children.forEach((child: TmaProduct) => {
              if (child.isBundle) {
                this.getProductOfferingGroupQuadPlay(child.code, selectedProductCode);
              }
            });
          }

        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }

  /**
   * Expands the current selections.
   */
  collapseCurrentSelection(): void {
    this.isCurrentSelectionExpanded = true;
  }

  /**
   * Collapses current selections.
   */
  expandCurrentSelection(): void {
    this.isCurrentSelectionExpanded = false;
  }

  /**
   * Returns if current selection is collapsed.
   *
   * @return True if current selection is collapsed, otherwise false
   */
  isCurrentSelectionCollapsed(): boolean {
    return !this.isCurrentSelectionExpanded;
  }

  /**
   * Removes the provided product from the current selection.
   *
   * @param product - The product which will be removed
   */
  removeProductFromCurrentSelection(product: TmaProduct): void {
    this.guidedSellingCurrentSelectionsService.changeSelection(
      product,
      TmaSelectionAction.REMOVE
    );
  }

  /**
   * Returns the sum of one time charges as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getPayNowPrice(
    price: TmaProductOfferingPrice[]
  ): TmaProductOfferingPrice[] | string {
    if (!price || price.length === 0) {
      return GUIDED_SELLING.CURRENT_SELECTION.DASH;
    }
    this.priceValue = this.priceService.getAllPriceList(price[0]);
    const oneTimePrices: TmaProductOfferingPrice[] = this.priceService.getPayNowPrices(
      this.priceValue
    );
    if (!oneTimePrices || oneTimePrices.length === 0) {
      return GUIDED_SELLING.CURRENT_SELECTION.DASH;
    }

    return oneTimePrices;
  }

  /**
   * Returns the first recurring charge as a formatted string.
   *
   * @param price - The product's list of prices
   * @return String containing the formatted price
   */
  getRecurringPrice(
    price: TmaProductOfferingPrice[]
  ): TmaProductOfferingPrice[] | string {
    if (!price || price.length === 0 || !price[0].bundledPop) {
      return GUIDED_SELLING.CURRENT_SELECTION.DASH;
    }

    this.priceValue = this.priceService.getAllPriceList(price[0]);
    const recurringPrices: TmaProductOfferingPrice[] = this.priceService.getRecurringPrices(
      this.priceValue
    );
    if (
      !recurringPrices ||
      recurringPrices.length === 0 ||
      !recurringPrices[0].price
    ) {
      return GUIDED_SELLING.CURRENT_SELECTION.DASH;
    }

    return recurringPrices;
  }

  /**
   * Adds a BPO to the cart.
   *
   * @param currentCart - The cart in which the BPO will be added
   */
  addBpoToCart(currentCart: TmaCart): void {
    if (this.qualificationErrorMessages.length) {
      this.showQualificationErrorMessages = true;
      return;
    }
    this.showQualificationErrorMessages = false;
    this.spinner.show();
    const productOfferingIds: string[] = [];
    this.currentSelections.forEach((product: TmaProduct) => {
      productOfferingIds.push(product.code);
    });
    this.subscription.add(
      this.tmaChecklistActionService
        .getChecklistActionsFor(
          this.currentBaseSiteId,
          productOfferingIds
        )
        .pipe(
          first((checklistResult: TmaChecklistAction[]) => !!checklistResult),
          distinctUntilChanged(),
          map((checklistResult: TmaChecklistAction[]) => {
            if (checklistResult.length === 0) {
              this.addBpoCart(currentCart);
            } else {
              const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
                (checklist: TmaChecklistAction) =>
                  this.config.journeyChecklist.journeyChecklistSteps.includes(
                    checklist.actionType
                  )
              );
              if (Object.keys(journeyCheckLists).length === 0) {
                this.addBpoCart(currentCart);
              } else {
                this.addToCartWithChecklist(journeyCheckLists, currentCart);
              }
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Removes everything from current selection and resets state.
   */
  clearCurrentSelection(): void {
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    this.guidedSellingStepsService.setFirstStepAsActiveStep();
  }

  /**
   * Check if the given product is part of the current selection list
   *
   * @param tmfProduct - The tmf product
   * @returns of {@link Boolean}
   */
  isPartOfCurrentSelection(tmfProduct: TmfProduct): boolean {
    return this.currentSelections.some((product: TmaProduct) => product.code === tmfProduct.productOffering.id);
  }

  /**
   * Search for the subscribed product
   *
   * @param productCode - Tma product code
   * @returns the tmf product id as a {@link string}
   */
  getSubscribedProduct(productCode: string): string {
    return this.tmfProducts && this.tmfProducts.some((tmfProduct: TmfProduct) => tmfProduct.productOffering.id === productCode) ?
      this.tmfProducts.find((tmfProduct: TmfProduct) => tmfProduct.productOffering.id === productCode).id : undefined;
  }

  protected calculateTotal(currentSelections: TmaProduct[]): string {
    let oneTimePrices: TmaProductOfferingPrice[] = [];
    currentSelections.forEach((product: TmaProduct) => {
      if (
        product &&
        product.productOfferingPrice &&
        product.productOfferingPrice.length !== 0
      ) {
        oneTimePrices = oneTimePrices.concat(
          this.priceService.getOneTimeCharges(product.productOfferingPrice[0])
        );
      }
    });

    if (!oneTimePrices || oneTimePrices.length === 0) {
      return GUIDED_SELLING.CURRENT_SELECTION.DASH;
    }

    return this.priceService.getFormattedPrice(
      this.priceService.getSumOfPrices(oneTimePrices)
    );
  }

  protected createCartItemList(children: TmaProduct[]): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    children.forEach((child: TmaProduct) => {
      if (child.isBundle) {
        this.subscription.add(
          this.productService
            .get(child.code)
            .pipe(
              first((product: TmaProduct) => product != null)
            )
            .subscribe((product: TmaProduct) => {
              if (this.createCartItemList(product.children).length > 0) {
                cartItemList.push({
                  productOffering: {
                    id: child.code
                  },
                  quantity: 1,
                  cartItem: this.createCartItemList(product.children)
                });
              }
            })
        );
        return;
      }
      if (this.currentSelections.some(selection => selection.code === child.code)) {
        const stepConfig = this.guidedSellingProductConfigSelectionsService.getStepConfigs()
          .find(config => config.product === child.code);
        if (stepConfig && stepConfig.configSelections.length > 0) {
          const characteristic = [];
          stepConfig.configSelections.forEach(configSelection => {
            characteristic.push({name: configSelection.name, value: configSelection.value});
          });

          cartItemList.push({
            productOffering: {
              id: child.code
            },
            quantity: 1,
            product: {
              characteristic: characteristic
            }
          });
        } else {
          cartItemList.push({
            productOffering: {
              id: child.code
            },
            quantity: 1
          });
        }
      }
    });
    return cartItemList;
  }

  protected createRetentionCartItemList(
    children: TmaProduct[]
  ): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    children.forEach((child: TmaProduct) => {
      if (child.isBundle) {
        this.subscription.add(
          this.productService
            .get(child.code)
            .pipe(
              first((product: TmaProduct) => product != null)
            )
            .subscribe((product: TmaProduct) => {
              if (
                this.createRetentionCartItemList(product.children).length > 0
              ) {
                cartItemList.push({
                  productOffering: {
                    id: child.code
                  },
                  quantity: 1,
                  cartItem: this.createRetentionCartItemList(product.children)
                });
              }
            })
        );
        return;
      }
      const cartItem: TmaTmfCartItem = this.getRetentionCartItem(child);
      if (cartItem) {
        cartItemList.push(cartItem);
      }
      ;
    });
    return cartItemList;
  }

  protected getRetentionCartItem(child: TmaProduct): TmaTmfCartItem {
    const tmfProduct: string[] = this.tmfProducts.map(
      (tmfProd: TmfProduct) => tmfProd.productOffering.id);


    return this.currentSelections
      .filter(e => !tmfProduct.includes(e.code))
      .some(selection => selection.code === child.code) ?
      {
        productOffering: {
          id: child.code
        },
        quantity: 1,
        action: TmaTmfActionType.ADD
      } :
      tmfProduct.some(productCode => productCode === child.code) ?
        {
          product: {
            id: this.tmfProducts.find(
              (product: TmfProduct) => product.productOffering.id === child.code
            ).id
          },
          quantity: 1,
          action: TmaTmfActionType.KEEP
        } : null;
  }

  protected prepareDataForModal(currentCart: TmaCart): void {
    this.subscription.add(
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
          const resolverAddedEntries: TmaOrderEntry[] = this.resolveEntries(newlyAddedEntries, []);
          if (newlyAddedEntries) {
            this.openModal(resolverAddedEntries);
          }
        })
    );
  }

  protected openModal(entries: TmaOrderEntry[]): void {
    this.spinner.hide();
    const modalInstanceData = {
      entry$: new Observable(
        (subscriber: Subscriber<TmaOrderEntry>) => subscriber.next(entries[0])
      ),
      entries: entries,
      parentBpo: this.parentBpo,
      cart$: this.activeCartService.getActive(),
      loaded$: this.activeCartService.isStable(),
      quantity: 1,
      increment: false
    };
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.TMA_GUIDED_SELLING_ADD_TO_CART,
      undefined,
      this.vcr,
      modalInstanceData
    );
    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }

  protected resolveEntries(items: TmaOrderEntry[], groupedItems: TmaOrderEntry[]): TmaOrderEntry[] {
    for (const item of items) {
      item.entries ?
        this.resolveEntries(item.entries, groupedItems) :
        groupedItems.push(item);
    }
    return groupedItems;
  }

  protected addToCartWithChecklist(
    journeyCheckLists: TmaChecklistAction[],
    currentCart: TmaCart
  ): void {
    this.addBpoCart(currentCart);
  }

  private addBpoCart(currentCart: TmaCart) {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      id: currentCart.code,
      guid: currentUserId === OCC_USER_ID_ANONYMOUS ? currentCart.guid : null,
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          processType: {
            id: (this.tmfProducts && this.tmfProducts.length > 0)
              ? TmaProcessTypeEnum.RETENTION
              : TmaProcessTypeEnum.ACQUISITION
          },
          productOffering: {
            id: this.bpoCode
          },
          quantity: 1,
          cartItem: (this.tmfProducts && this.tmfProducts.length > 0)
            ? this.createRetentionCartItemList(this.parentBpo.children)
            : this.createCartItemList(this.parentBpo.children)
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);


    this.addToCartButton.nativeElement.disabled = true;
    this.prepareDataForModal(currentCart);
    this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
    this.guidedSellingProductConfigSelectionsService.clearStepConfigs();
    this.spinner.hide();
  }

  private setProductDetails(modalInstance: any) {
    const productOfferings = new Map();
    this.currentSelections.forEach(currentSelection => {
      productOfferings.set(currentSelection.code, currentSelection.name);
    });
    modalInstance.product = productOfferings;
  }
}
