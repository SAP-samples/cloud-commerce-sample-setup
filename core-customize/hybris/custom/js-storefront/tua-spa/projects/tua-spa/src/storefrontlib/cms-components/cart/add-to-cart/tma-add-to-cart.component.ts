// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional
} from '@angular/core';
import {
  BaseSiteService,
  CmsAddToCartComponent,
  EventService,
  GlobalMessageService,
  GlobalMessageType,
  OCC_USER_ID_ANONYMOUS,
  ProductSearchPage,
  ProductService,
  RoutingService,
  TranslationService,
  User
} from '@spartacus/core';
import {
  CmsComponentData,
  CurrentProductService,
  ICON_TYPE,
  LaunchDialogService,
  ProductListItemContext
} from '@spartacus/storefront';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, combineLatest, concat, Observable, Subscription } from 'rxjs';
import { filter, first, last, map, switchMap, take } from 'rxjs/operators';
import {
  Appointment,
  AvailabilityCheckService,
  CheckCpiProductQualificationService,
  GeographicAddress,
  GeographicAddressService,
  JourneyChecklistConfig,
  LOCAL_STORAGE,
  LogicalResourceType,
  RelatedPlaceRef,
  Reservation,
  ResourceRef,
  SearchTimeSlot,
  SearchTimeSlotService,
  TmaActiveCartFacade,
  TmaChecklistAction,
  TmaChecklistActionService,
  TmaChecklistActionType,
  TmaConfigurablePscInputsDataHandlingService,
  TmaConstantResourceModel,
  TmaOrderEntry,
  TmaProcessTypeEnum,
  TmaProduct,
  TmaProductSearchService,
  TmaProductService,
  TmaPscvuProductCharaceristic,
  TmaStateWithChecklistAction,
  TmaTmfActionType,
  TmaTmfCartItem,
  TmaTmfCartService,
  TmaTmfShoppingCart,
  Tmf,
  TmfProduct,
  TmfProductCharacteristic
} from '../../../../core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { AddToCartComponent } from '@spartacus/cart/base/components/add-to-cart';
import { SelfcareService } from '../../../../core/selfcare';
import { TmaUserIdService } from '../../../../core/user/facade/tma-user-id.service';
import { select, Store } from '@ngrx/store';
import * as TmaChecklistActionSelectors
  from '../../../../core/checklistaction/store/selectors/tma-checklist-action.selector';
import { TmaAddToCartService } from '../../../../core/add-to-cart';
import TmfCartTerm = Tmf.TmfCartTerm;

const { FREE_TEXT, PRODUCT_SPECIFICATION } = LOCAL_STORAGE.SEARCH;
const { MONTHLY_24 } = LOCAL_STORAGE.SUBSCRIPTION_TERM;
const { QUANTITY } = LOCAL_STORAGE.CART_ITEM;
const { APPOINTMENT, INSTALLATION_ADDRESS, MSISDN_RESERVATION } = LOCAL_STORAGE;

@Component({
  selector: 'cx-add-to-cart',
  templateUrl: './tma-add-to-cart.component.html',
  styleUrls: ['./tma-add-to-cart.component.scss'],
  providers: [CheckCpiProductQualificationService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAddToCartComponent
  extends AddToCartComponent
  implements OnInit, OnDestroy {
  @Input()
  product: TmaProduct;

  @Input() productCode: string;

  @Input()
  seeDetails: boolean = false;

  @Input()
  skipChecklistActionCheck: boolean;

  @Input()
  rootProductCode?: string;

  @Input()
  targetProductCode?: string;

  @Input()
  childProductCodes?: string[] = [];

  @Input()
  showCart: boolean = true;

  @Input()
  isPdpTheCurrentPage?: boolean = true;

  @Input()
  isPdpServicePage?: boolean = false;

  @Input()
  isPlpCarouselPage?: boolean = false;


  currentProduct$: Observable<TmaProduct>;
  result: boolean;
  processType?: TmaProcessTypeEnum;
  checklistActions: TmaChecklistAction[];
  msisdnValueSelected: string;
  tmaProduct: TmaProduct;
  iconTypes = ICON_TYPE;
  dependantProductNamesList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  dependantProduct: TmaProduct;

  protected baseSiteId: string;
  protected subscriptions = new Subscription();
  protected currentUser: User;
  protected currentBaseSiteId: string;

  constructor(
    protected currentProductService: CurrentProductService,
    protected cd: ChangeDetectorRef,
    protected userIdService: TmaUserIdService,
    protected activeCartService: TmaActiveCartFacade,
    protected component: CmsComponentData<CmsAddToCartComponent>,
    protected eventService: EventService,
    protected store: Store<TmaStateWithChecklistAction>,
    protected tmaAddToCartService: TmaAddToCartService,
    protected launchDialogService: LaunchDialogService,
    protected selfCareService: SelfcareService,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected baseSiteService: BaseSiteService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected config: JourneyChecklistConfig,
    protected userAccountFacade: UserAccountFacade,
    protected geographicAddressService: GeographicAddressService,
    protected productService: ProductService,
    protected spinner: NgxSpinnerService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected availabilityCheckService: AvailabilityCheckService,
    protected searchTimeSlotService: SearchTimeSlotService,
    protected productSearchService: TmaProductSearchService,
    public productSpecificationProductService: TmaProductService,
    public routingService: RoutingService,
    public configurablePscvusService: TmaConfigurablePscInputsDataHandlingService,
    @Optional() protected productListItemContext?: ProductListItemContext
  ) {
    super(currentProductService, cd, activeCartService, component, eventService);

    this.currentProduct$ = this.currentProductService.getProduct();

    this.subscriptions.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
      );

    this.subscriptions.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null)
        )
        .subscribe((user: User) => (this.currentUser = user))
      );

    this.getChecklistActions(this.productCode);

    this.subscriptions.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
      );

    this.productSearchService.clearResults();
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.skipChecklistActionCheck === undefined) {
      this.skipChecklistActionCheck = this.productSearchService.addToCartServiceableProduct();
    }
    this.configurablePscvusService.cleanData();
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    if (!this.isPlpCarouselPage && !this.isPdpServicePage) {
      this.tmaAddToCartService.clearAddToCartPayloadState();
      this.tmaChecklistActionService.clearChecklistActionWithAddToCartDetails();
    }
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.availabilityCheckService.clearSelectedLogicalResourceState();
    this.searchTimeSlotService.clearSelectedSearchTimeSlotState();
    this.dependantProductNamesList$.complete();
    this.selfCareService.clearSubscriptionsState();
    this.subscriptions?.unsubscribe();
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }

  getDisplayChecklists(productCode: string): Observable<string> {
    if (productCode) {
      return this.productService.get(productCode)
          .pipe(
              first((product: TmaProduct) => product !== undefined),
              switchMap((product: TmaProduct) => {
                if (product.isBundle) {
                  const dependencies: Observable<string>[] = product.children.map(child =>
                      this.tmaChecklistActionService.getCurrentViewForDependentProduct(child.code)
                  );
                  return concat(...dependencies);
                } else {
                  return this.tmaChecklistActionService.getCurrentViewForDependentProduct(productCode);
                }
              })
          );
    }
    return undefined;
  }

  addToCart() {
    this.subscriptions.add(
      this.tmaAddToCartService.getAddToCartPayloadState().pipe(take(1)).subscribe((payload) => {
        this.subscriptions.add(
          this.addToCartPreconditions(payload).pipe(filter((res) => res !== undefined)).subscribe(
            (finalPayload) => {
              this.tmaTmfCartService.updateCart(finalPayload);
              if (!this.isPlpCarouselPage && !this.isPdpServicePage) {
                this.tmaAddToCartService.clearAddToCartPayloadState();
                this.tmaChecklistActionService.clearChecklistActionWithAddToCartDetails();
              }
              this.addToCartDialog(1);
            }
          )
        );
      })
    );
  }

  protected addToCartPreconditions(payload: TmaTmfShoppingCart): Observable<any> {
    this.currentProduct$
        .pipe(take(1))
        .subscribe(product => this.tmaProduct = product);
    const children: string[] = this.tmaProduct?.isBundle
        ? this.tmaProduct.children.map((product: TmaProduct) => product.code) : [];
    return combineLatest([
      this.tmaProduct?.isBundle ?  this.getChecklistActionsForBundle(children) : this.getChecklistActions(this.productCode),
      this.userIdService.getCustomerId(),
      this.baseSiteService.getActive(),
      this.store.pipe(
        select(TmaChecklistActionSelectors.getAllChecklistActionsDetails))
    ]).pipe(
      take(1),
      map(([checklistActions, userId, baseSiteId, checklistListActionsFullFiled]) => {
        if (!checklistActions.length) {
          const quantity = this.addToCartForm.get(QUANTITY).value;
          if (!this.product?.isBundle || !this.tmaProduct?.isBundle) {
            this.addCartEntry(undefined, undefined, undefined, quantity);
          }
          return undefined;
        }
        const completedChecklistActions = checklistActions.filter(checklistAction => {
          return checklistListActionsFullFiled.find(completedChecklistAction => checklistAction.actionType === completedChecklistAction.type);
        });
        if (!this.skipChecklistActionCheck) {
          if (!checklistListActionsFullFiled.length || payload === undefined) {
            this.displayChecklistActionErrorMessages(checklistActions);
            return undefined;
          }
          if (completedChecklistActions.length !== checklistActions.length) {
            const notCompletedChecklistActions = checklistActions.filter(checklistAction => {
              return completedChecklistActions.find(completedChecklistAction => checklistAction.actionType === completedChecklistAction.actionType) === undefined;
            });
            this.displayChecklistActionErrorMessages(notCompletedChecklistActions);
            return undefined;
          }
        }
        if (this.product?.isBundle || this.tmaProduct?.isBundle) {
          return {
            baseSiteId: baseSiteId,
            relatedParty: [
              {
                id: userId
              }
            ],
            cartItem: [
              {
                processType: {
                  id: TmaProcessTypeEnum.ACQUISITION
                },
                productOffering: {
                  id: this.productCode
                },
                quantity: this.addToCartForm.get(QUANTITY).value,
                cartItem: this.createCartFixedItemList(this.isPdpTheCurrentPage ? this.tmaProduct.children : this.product.children, payload.cartItem[0])
              }
            ]
          };
        }

        let subscriptionTerms: TmfCartTerm[];
        subscriptionTerms = this.tmaProduct?.productSpecification !== undefined ?
            [{
              id: MONTHLY_24
            }] : undefined;

        if (!subscriptionTerms && this.product) {
          subscriptionTerms = this.product.productOfferingPrice[0]?.productOfferingTerm[0]?.id !== undefined ?
            [{
              id: this.product.productOfferingPrice[0]?.productOfferingTerm[0]?.id
            }] : undefined;
        }

        return {
          baseSiteId: baseSiteId,
          relatedParty: [
            {
              id: userId
            }
          ],
          cartItem: [
            {
              ...payload.cartItem[0],
              productOffering: {
                id: this.productCode
              },
              quantity: this.addToCartForm.get(QUANTITY).value,
              itemTerm: subscriptionTerms
            }
          ]
        };
      })
    );
  }

  /**
   * Returns the checklist actions for the provided product code
   *
   * @param productCode - product code
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActions(productCode: string): Observable<TmaChecklistAction[]> {
    return this.tmaChecklistActionService.getChecklistActionForProductCode(
      this.baseSiteId,
      productCode
    );
  }

  /**
   * Returns the checklist actions for the provided product codes
   *
   * @param productCodes - product codes
   * @return List of {@link TmaChecklistAction} as an {@link Observable}
   */
  getChecklistActionsForBundle(productCodes: string[]): Observable<TmaChecklistAction[]> {
    return this.tmaChecklistActionService.getChecklistActionsFor(
        this.baseSiteId,
        productCodes
    );
  }

  /**
   * Checks if installation address is provided or not
   *
   * @return True if has installation address present, otherwise false
   */
  isInstallationAddressSelected(): boolean {
    let selectedInstallationAddress: boolean = false;
    this.subscriptions.add(
      this.geographicAddressService
        .getSelectedInstallationAddress()
        .pipe(
          take(2),
          filter((result: GeographicAddress) => !!result)
        )
        .subscribe((result: GeographicAddress) => {
          if (Object.keys(result).length > 0) {
            selectedInstallationAddress = true;
          }
        })
      );
    return selectedInstallationAddress;
  }

  /**
   * Checks if search time slot is provided or not
   *
   * @return True if has search time slot present, otherwise false
   */
  isSearchTimeSlotSelected(): boolean {
    let searchTimeSlotSelected: boolean = false;
    this.subscriptions.add(
      this.searchTimeSlotService
        .getSelectedTimeSlot()
        .pipe(
          take(2),
          filter((result: SearchTimeSlot) => !!result)
        )
        .subscribe((result: SearchTimeSlot) => {
          if (Object.keys(result).length > 0) {
            searchTimeSlotSelected = true;
          }
        })
      );
    return searchTimeSlotSelected;
  }

  /**
   * Checks if MSISDN is provided or not
   *
   * @return True if has MSISDN present, otherwise false
   */
  isMsisdnSelected(): boolean {
    let msisdnSelected: boolean = false;
    this.subscriptions.add(
      this.availabilityCheckService
        .getSelectedLogicalResource()
        .pipe(
          filter((result: ResourceRef) => !!result)
        )
        .subscribe((result: ResourceRef) => {
          if (Object.keys(result).length > 0) {
            msisdnSelected = true;
          }
        })
      );
    return msisdnSelected;
  }

  /**
   * Checks if the Add To Cart button should be displayed
   *
   * @param checklistActions - list of checklist actions
   * @param productSpecificationId - product specification id
   */
  shouldDisplayAddToCartButton(
    checklistActions: TmaChecklistAction[],
    productSpecificationId: string
  ): boolean {
    if (
      !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      )
    ) {
      return !this.productSpecificationProductService.isProductSpecificationForViewDetails(
        productSpecificationId
      );
    }
    if (
      checklistActions.find(
        (checklistAction: TmaChecklistAction) =>
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
      )
    ) {
      return false;
    }
    this.translationService
      .translate('premiseDetails.checkAvailabilityErrorMessage')
      .pipe(first((translation: string) => !!translation))
      .subscribe((translation: string) =>
        this.globalMessageService.add(
          translation,
          GlobalMessageType.MSG_TYPE_ERROR
        )
      )
      .unsubscribe();
    return true;
  }

  /**
   * Disable add to cart button if the checklist actions are not fulfilled
   *
   * @param checklistActions list of {@link TmaChecklistAction}
   * @returns True if checklist actions is not fulfilled
   */
  disableAddToCart(checklistActions: TmaChecklistAction[]): boolean {
    if (this.skipChecklistActionCheck) {
      return false;
    }
    let appointmentNotSelected: boolean = false;
    let installationAddressNotSelected: boolean = false;
    let msisdnNotSelected: boolean = false;
    if (checklistActions) {
      checklistActions.forEach((checklistAction: TmaChecklistAction) => {
        if (checklistAction.actionType === TmaChecklistActionType.APPOINTMENT) {
          appointmentNotSelected = !this.isSearchTimeSlotSelected();
        }
        if (
          checklistAction.actionType ===
          TmaChecklistActionType.INSTALLATION_ADDRESS
        ) {
          installationAddressNotSelected =
            !this.isInstallationAddressSelected();
        }
        if (checklistAction.actionType === TmaChecklistActionType.MSISDN) {
          msisdnNotSelected = !this.isMsisdnSelected();
        }
      });
      return (
        appointmentNotSelected ||
        installationAddressNotSelected ||
        msisdnNotSelected
      );
    }
  return false;
  }

  protected addToCartDialog(quantity: number) {
    const newEntry$: Observable<TmaOrderEntry> =
    this.activeCartService.getSpoWithHighestEntryNumber(this.productCode);
    this.subscriptions.add(
      newEntry$
        .pipe(
          take(2),
          filter((newEntry: TmaOrderEntry) => !!newEntry),
          last()
        )
        .subscribe((newEntry: TmaOrderEntry) => {
          this.eventService.dispatch(
            this.createCartUiEventAddToCart(
              this.productCode,
              quantity,
              newEntry.quantity
            )
          );
          this.spinner.hide();
        })
      );
    }

  protected getDependantProductNameList(dependantProductSpecs) {
    const dependantProductNames: string[] = [];

    dependantProductSpecs.forEach((dependantProductSpec) => {
      this.productSearchService.search(":" + FREE_TEXT + PRODUCT_SPECIFICATION + dependantProductSpec);
      this.subscriptions.add(
        this.productSearchService.getResults()
          .pipe(
            first((result: ProductSearchPage) => !!result)
          )
          .subscribe((result: ProductSearchPage) => {
            if (result) {
              if (!this.dependantProduct){
                this.dependantProduct = result.products?.[0];
              }
              dependantProductNames.push(result.products?.[0].name);
              this.dependantProductNamesList$.next(dependantProductNames);
            }
          })
        );
    });
  }

  protected createAppointment(id: string): Appointment {
    if (id === undefined) {
      return undefined;
    }
    return {
      id: id
    };
  }

  protected createTmfResource(
    msisdnValue: Reservation,
    addressId: string
  ): TmfProduct {
    let characteristics: TmfProductCharacteristic[] = [];
    characteristics = characteristics.concat(
      this.configurablePscvusService
        .getProductCharacteristics()
        ?.map<TmfProductCharacteristic>(
          (pscvu: TmaPscvuProductCharaceristic) => ({
            name: pscvu.name,
            value: pscvu.value
          })
        )
    );
    characteristics = characteristics.concat(this.createMsisdn(msisdnValue));
    characteristics = characteristics.filter(
      (char: TmaPscvuProductCharaceristic) => char
    );

    return {
      place: this.populateInstallationAddress(addressId),
      characteristic: characteristics.length > 0 ? characteristics : undefined
    };
  }

  protected createMsisdn(msisdnValue: Reservation): TmfProductCharacteristic[] {
    if (!msisdnValue) {
      return undefined;
    }
    return [
      {
        id: msisdnValue.id,
        name: LogicalResourceType.MSISDN,
        value: this.msisdnValueSelected
      }
    ];
  }

/** @deprecated since v6.0.0 - use populateInstallationAddress() instead. */
  protected createInstallationAddress(addressId: string): RelatedPlaceRef[] {
    if (!addressId) {
      return undefined;
    }
    return [
      {
        id: addressId,
        '@referredType': 'GeographicAddress',
        role: 'INSTALLATION_ADDRESS'
      }
    ];
  }

  protected createCartFixedItemList(children: TmaProduct[], payload?: TmaTmfCartItem): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    children.forEach((child: TmaProduct) => {
      let hasAppointment: boolean = false;
      let hasPlace: boolean = false;
      let hasMsisdn: boolean = false;

      this.subscription.add(
        this.getChecklistActions(child.code).subscribe((res: TmaChecklistAction[]) => {
          hasAppointment = res.some((action) =>
              action.actionType === APPOINTMENT.CHECKLIST_ACTION_TYPE_APPOINTMENT);
          hasPlace = res.some((action) =>
              action.actionType === INSTALLATION_ADDRESS.CHECKLIST_ACTION_TYPE_INSTALLATION_ADDRESS);
          hasMsisdn = res.some((action) =>
              action.actionType === MSISDN_RESERVATION.CHECKLIST_ACTION_TYPE_MSISDN);
        })
      );

      cartItemList.push({
        productOffering: {
          id: child.code
        },
        product: {
          characteristic: hasMsisdn ? payload.product.characteristic : undefined,
          place: hasPlace ? payload.product.place : undefined
        },
        appointment: hasAppointment ? payload.appointment  : undefined,
        quantity: 1
      });
    });
    return cartItemList;
  }

  protected addCartEntry(
    appointmentId?: string,
    installationAddress?: GeographicAddress,
    msisdnValue?: Reservation,
    quantity?: number
  ): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const installationAddressId = installationAddress
      ? installationAddress.id
      : undefined;

    const subscriptionTerms: TmfCartTerm[] =
      this.tmaProduct?.productSpecification !== undefined ?
      [{
        id: MONTHLY_24
      }] : undefined;

    if (
      msisdnValue !== undefined &&
      !!msisdnValue.reservationItem[0] &&
      !!msisdnValue.reservationItem[0].appliedCapacityAmount[0].resource[0]
        .value
    ) {
      this.msisdnValueSelected =
        msisdnValue.reservationItem[0].appliedCapacityAmount[0].resource[0].value;
    }

    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: [
        {
          action: TmaTmfActionType.ADD,
          processType: {
            id: TmaProcessTypeEnum.ACQUISITION
          },
          productOffering: {
            id: this.productCode
          },
          quantity: quantity,
          itemTerm: subscriptionTerms,
          appointment: this.createAppointment(appointmentId),
          product: this.createTmfResource(msisdnValue, installationAddressId)
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };

    this.tmaTmfCartService.updateCart(shoppingCart);

    if (!this.showCart) {
      this.routingService.go({cxRoute: 'cart'});
    } else {
      this.addToCartDialog(quantity);
    }

    this.configurablePscvusService.cleanData();
  }

  protected displayChecklistActionErrorMessages(checklistActions: TmaChecklistAction[]) {
    const actionTypes = [];
    checklistActions.forEach((checklistAction) => {
      actionTypes.push(checklistAction.actionType);
    });
    const lastChecklistAction = actionTypes.pop();
    const sentence = actionTypes.join(', ') + (actionTypes.length > 1 ? ', ' : ' ') + (actionTypes.length > 0 ? 'and' : '') + ' ' + lastChecklistAction;
    this.globalMessageService.add(
      {
        key: 'checkList.errorMessage.checklistActionsNotFullFiled',
        params: {
          sentence: `${sentence}`
        },
      },
      GlobalMessageType.MSG_TYPE_ERROR
    )
  }

  protected populateInstallationAddress(addressId: string): RelatedPlaceRef[] {
    if (!addressId) {
      return undefined;
    }
    return [
      {
        id: addressId,
        '@referredType': 'GeographicAddress',
        role: 'INSTALLATION_ADDRESS'
      }
    ];
  }

  private addFixedBpoToCart(baseSite: string) {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: baseSite,
      cartItem: [
        {
          processType: {
            id: TmaProcessTypeEnum.ACQUISITION
          },
          productOffering: {
            id: this.productCode
          },
          quantity: 1,
          cartItem: this.createCartFixedItemList(this.isPdpTheCurrentPage ? this.tmaProduct.children : this.product.children)
        }
      ],
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);

    if (!this.showCart) {
      this.routingService.go({cxRoute: 'cart'});
    } else {
      this.addToCartDialog(1);
    }
  }
}
