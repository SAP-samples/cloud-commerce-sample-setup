// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  BaseSiteService,
  CmsService,
  CurrencyService,
  GlobalMessageService,
  Page,
  ProductService,
  TranslationService,
  User
} from '@spartacus/core';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, first, map, take } from 'rxjs/operators';
import {
  GeographicAddress,
  GeographicAddressService,
  JourneyChecklistConfig,
  LogicalResource,
  LogicalResourceReservationService,
  LogicalResourceType,
  TmaActiveCartFacade,
  TmaBillingFrequencyConfig,
  TmaCartPriceService,
  TmaCharacteristic,
  TmaChecklistAction,
  TmaChecklistActionService,
  TmaChecklistActionTypeCheckService,
  TmaConsumptionChangeService,
  TmaGeographicAddressConverter,
  TmaInstallationAddressConverter,
  TmaPlace,
  TmaPlaceRole,
  TmaPremiseDetail,
  TmaPremiseDetailInteractionService,
  TmaPremiseDetailService,
  TmaPriceService,
  TmaProduct,
  TmaProductService,
  TmaRelatedParty,
  TmaRelatedPartyRole,
  TmaSubscribedProduct,
  TmaTmfCartService,
  TmaTechnicalDetails,
  TmaOrderEntry
} from '../../../../../core';
import { TmaUserAddressService } from '../../../../../core/user/facade/tma-user-address.service';
import { CartItemContext } from '@spartacus/cart/base/root';
import { CartItemComponent, CartItemContextSource } from '@spartacus/cart/base/components';
import { LaunchDialogService } from '@spartacus/storefront';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { SelfcareService } from '../../../../../core/selfcare';
import { UserAccountFacade } from '@spartacus/user/account/root';

const { TECHNICAL_ID, AVERAGE_CONSUMPTION_ESTIMATION } = LOCAL_STORAGE.SUBSCRIBED_PRODUCT.CHARACTERISTIC;
const { MOVE,
  SWITCH_PROVIDER
} = LOCAL_STORAGE.REASON_FOR_PURCHASE;
const { PURCHASE_WITH_ASSURANCE_FEATURE
} = LOCAL_STORAGE.TMA_FEATURE_FLAGS

@Component({
  selector: 'cx-cart-item',
  templateUrl: './tma-cart-item.component.html',
  styleUrls: ['./tma-cart-item.component.scss'],
  providers: [
    CartItemContextSource,
    { provide: CartItemContext, useExisting: CartItemContextSource },
  ],
  animations: [
    trigger('slideInOut', [
      state('false', style({ height: '0px', overflow: 'hidden' })),
      state('true', style({ height: '*' })),
      transition('1 => 0', animate('500ms ease-in')),
      transition('0 => 1', animate('500ms ease-out'))
    ])
  ]
})
export class TmaCartItemComponent extends CartItemComponent implements OnInit, OnDestroy {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;


  @Input()
  item: TmaOrderEntry;

  @Input()
  displayPrices = true;

  @Input()
  isRemovable: boolean;

  @Input()
  showEdit?: boolean;

  @Input()
  showConsumption?= true;

  @Input()
  qtyDisabled = false;

  @Input()
  isPremiseDetailsReadOnly: boolean;

  @Input()
  isAddedToCartDialog?: boolean = false;

  @Input()
  enableChecklistActions?: boolean = true;

  @Input()
  isEdit?: boolean = false;

  @Output()
  tmaItem = new EventEmitter<any>();

  page$: Observable<Page>;
  premiseDetails: TmaPremiseDetail;
  serviceProvider: string;
  product$: Observable<TmaProduct>;
  currency$: Observable<string>;
  itemLogicalResources: LogicalResource[];
  checklistAction$: TmaChecklistAction[];
  url$: Observable<UrlSegment[]>;
  geographicAddress$: Observable<GeographicAddress>;
  place: TmaPlace;
  detailedPlace: GeographicAddress;
  toggleEditButton: boolean = true;
  consumptionUsage: {unit: string, billingFrequency: string};

  protected subscription = new Subscription();
  protected baseSiteId: string;
  protected consumption: number;
  protected isCurrentSelectionExpanded: boolean;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected readonly PURCHASE_WITH_ASSURANCE_FEATURE = PURCHASE_WITH_ASSURANCE_FEATURE;

  constructor(
    public cartPriceService: TmaCartPriceService,
    public checklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    protected currencyService: CurrencyService,
    protected cartItemContextSource: CartItemContextSource,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected consumptionChangeService: TmaConsumptionChangeService,
    public productSpecificationProductService?: TmaProductService,
    public priceService?: TmaPriceService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected cartService?: TmaActiveCartFacade,
    protected tmaUserAddressService?: TmaUserAddressService,
    protected tmaPremiseDetailService?: TmaPremiseDetailService,
    protected globalMessageService?: GlobalMessageService,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected installationAddressConverter?: TmaInstallationAddressConverter,
    protected geographicAddressConverter?: TmaGeographicAddressConverter,
    protected translationService?: TranslationService,
    protected productService?: ProductService,
    protected premiseDetailInteractionService?: TmaPremiseDetailInteractionService,
    protected baseSiteService?: BaseSiteService,
    protected config?: JourneyChecklistConfig,
    protected cmsService?: CmsService,
    protected billingFrequencyConfig?: TmaBillingFrequencyConfig,
    protected activatedRoute?: ActivatedRoute,
    protected selfcareService?: SelfcareService,
    protected geographicAddressService?: GeographicAddressService,
    protected userAccountFacade?: UserAccountFacade,
    protected tmaTmfCartService?: TmaTmfCartService,
    protected changeDetectorRef?: ChangeDetectorRef
  ) {
    super( cartItemContextSource);
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
  }

  ngOnInit(): void {
    this.product$ = this.productService.get(this.item.product.code);
    this.serviceProvider = this.getServiceProvider(this.item);
    this.url$ = this.activatedRoute.url;
    this.page$ = this.cmsService.getCurrentPage();
    this.currency$ = this.currencyService.getActive();

    this.itemLogicalResources = this.getLogicalResources(
      this.item.subscribedProduct.characteristic
    );
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );

    if (this.enableChecklistActions) {
      this.subscription.add(
        this.tmaChecklistActionService.getChecklistActionForProductCode(
            this.baseSiteId,
            this.item.product.code,
            this.item.processType.id
        ).pipe(
            take(2),
            filter((checklistResult: TmaChecklistAction[]) => !!checklistResult),
            distinctUntilChanged(),
            map((checklistResult: TmaChecklistAction[]) => {
              if (Object.keys(checklistResult).length !== 0) {
                const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
                    (checklist: TmaChecklistAction) =>
                        this.config.journeyChecklist.journeyChecklistSteps.includes(
                            checklist.actionType
                        )
                );
                if (Object.keys(journeyCheckLists).length !== 0) {
                  this.checklistAction$ = journeyCheckLists;
                } else {
                  this.checklistAction$ = undefined;
                }
              } else {
                this.checklistAction$ = undefined;
              }
            })
        )
            .subscribe()
      );
    }
    else {
      this.checklistAction$ = undefined;
    }

    this.place = this.item && this.item.subscribedProduct && this.item.subscribedProduct.place ?
      this.item.subscribedProduct.place.find((address: TmaPlace) => address.role === TmaPlaceRole.INSTALLATION_ADDRESS) : null;

    if (this.place !== null)
    {
      this.geographicAddress$ = this.geographicAddressService.getGeographicAddress(this.baseSiteId, this.place.id);
      this.subscription.add(
        combineLatest([
          this.geographicAddress$,
          this.product$
          ]).pipe(
          filter(([address, product]) => address !== undefined && product !== undefined)
        ).subscribe(([address, product]) => {
          this.detailedPlace = address;
          this.premiseDetails = this.getPremiseDetails(product);
          this.changeDetectorRef.detectChanges();
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  removeItem() {
    if (!!this.itemLogicalResources) {
      this.logicalResourceReservationService.clearInvalidReservations(
        this.itemLogicalResources
      );
    }
    super.removeItem();
  }

  /**
   * Returns the premise details based on information from cart item and product.
   *
   * @param product - The product offering
   * @return The premise details as {@link TmaPremiseDetail}
   */
  getPremiseDetails(product: TmaProduct): TmaPremiseDetail {
    return {
      installationAddress: undefined,
      technicalDetails: this.getTechnicalDetails(product)
    };
  }

  /**
   * Checks if the cart item has installation address
   *
   * @return True {@link boolean} if cart item has installation address, otherwise false
   */
  hasInstallationAddress(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.place &&
      this.item.subscribedProduct.place.find((place: TmaPlace) => place.role === TmaPlaceRole.INSTALLATION_ADDRESS));
  }

  /**
   * Check Logical Resource present in cart item
   *
   * @return a {@link LogicalResource}
   */
  hasLogicalResource(item: TmaOrderEntry): LogicalResource[] {
    if (item &&
      item.subscribedProduct &&
      item.subscribedProduct.characteristic) {
      return this.getLogicalResources(
        item.subscribedProduct.characteristic
      );
    }
    return [];
  }

  getTechnicalDetails(product: TmaProduct): TmaTechnicalDetails {
    return this.item && this.item.subscribedProduct && this.item.subscribedProduct.characteristic ? {
      id: this.getValueOfTechnicalId(this.item.subscribedProduct),
      type: product.productSpecification?.id
    } : null;
  }

  protected getServiceProvider(item: TmaOrderEntry): string {
    this.serviceProvider = item &&
      item.subscribedProduct &&
      item.subscribedProduct.relatedParty ?
      item.subscribedProduct.relatedParty.find((relatedParty: TmaRelatedParty) => relatedParty.role === TmaRelatedPartyRole.SERVICE_PROVIDER).id :
      null;
    return this.serviceProvider;
  }

  protected getLogicalResources(
    characteristics: TmaCharacteristic[]
  ): LogicalResource[] {
    const logicalResources: LogicalResource[] = [];
    if (!characteristics) {
      return[];
    }
    characteristics.forEach((characteristic: TmaCharacteristic) => {
      if (
        !!characteristic.name &&
        Object.values(LogicalResourceType).includes(
          LogicalResourceType[characteristic.name.toUpperCase()]
        )
      ) {
        const logicalResource: LogicalResource = {};
        logicalResource.type =
          LogicalResourceType[characteristic.name.toUpperCase()];
        logicalResource.value = characteristic.value;
        logicalResources.push(logicalResource);
      }
    });
    return logicalResources;
  }

  private getValueOfTechnicalId(subscribedProduct: TmaSubscribedProduct): string {
    const characteristic = subscribedProduct.characteristic.find((tmaCharacteristic: TmaCharacteristic) =>
      tmaCharacteristic.name === TECHNICAL_ID);
    if (characteristic) {
      return characteristic.value;
    }
    return '';
  }

  getTechnicalId(item: TmaOrderEntry): string {
    if(item.subscribedProduct !== null && item.subscribedProduct.characteristic !== null){
      return item.subscribedProduct.characteristic.find(value => value.name === TECHNICAL_ID).value.toString();
    }
    return null;
  }

  getAverageConsumption(item: TmaOrderEntry): string {
    if(item.subscribedProduct !== null && item.subscribedProduct.characteristic !== null){
      return item.subscribedProduct.characteristic.find(value => value.name === AVERAGE_CONSUMPTION_ESTIMATION).value.toString();
    }
    return null;
  }

  hasTechnicalId(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.characteristic &&
      this.item.subscribedProduct.characteristic.find(value => value.name === TECHNICAL_ID)?.value.toString());
  }

  hasContractStartDate(item: TmaOrderEntry): boolean {
    return item.contractStartDate !== undefined;
  }

  hasAverageConsumption(): boolean {
    return !!(this.item &&
      this.item.subscribedProduct &&
      this.item.subscribedProduct.characteristic &&
      this.item.subscribedProduct.characteristic.find(value => value.name === AVERAGE_CONSUMPTION_ESTIMATION)?.value.toString());
  }

  getFormattedAddress(place: TmaPlace): string {
    let formattedAddress: string = "";

    if (place.line1 !== undefined)
    {
      formattedAddress = formattedAddress + place.line1;
    }

    if (place.line2 !== undefined)
    {
      formattedAddress = formattedAddress + ", " + place.line2;
    }

    if (place.town !== undefined)
    {
      formattedAddress = formattedAddress + ", " + place.town;
    }

    if (place.region !== undefined && place.region.name !== undefined)
    {
      formattedAddress = formattedAddress + ", " + place.region.name;
    }

    if (place.country !== undefined)
    {
      formattedAddress = formattedAddress + ", " + place.country.name;
    }

    if (place.postalCode !== undefined)
    {
      formattedAddress = formattedAddress + ", " + place.postalCode;
    }

    return formattedAddress;
  }
}
