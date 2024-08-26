// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import {
  CheckCpiProductQualificationService,
  CheckProductOfferingQualificationService,
  GeographicAddress,
  GeographicAddressService,
  LOCAL_STORAGE,
  RelatedPlaceRef,
  TmaChecklistActionAction,
  TmaChecklistActionService,
  TmaChecklistActionsState,
  TmaChecklistActionType,
  TmaOrderEntry,
  TmaPlaceRole,
  TmaProduct,
  TmaProductOfferingQualification,
  TmaProductOfferingQualificationItem,
  TmaProductRelationshipType,
  TmaSubscriptions,
  TmaTmfCartItem,
  TmaTmfCartService,
  TmaTmfShoppingCart
} from '../../../../core';
import { CurrentProductService } from '@spartacus/storefront';
import { SelfcareService } from '../../../../core/selfcare';
import {
  BaseSiteService,
  GlobalMessageService,
  isNotNullable,
  ProductService,
  RoutingService,
  TranslationService,
  User
} from '@spartacus/core';
import { filter, first } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { TmaAddToCartService } from '../../../../core/add-to-cart';
import { Store } from '@ngrx/store';

const { DEPENDENT_BUNDLE, PAGES } = LOCAL_STORAGE;

@Component({
  selector: 'cx-dependent-product',
  templateUrl: './dependent-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CheckCpiProductQualificationService]
})
export class DependentProductComponent implements OnInit, OnDestroy {
  @Input()
  tmaItem: TmaOrderEntry;

  @Input()
  showEdit?: boolean = false;

  currentProduct$: Observable<TmaProduct> = this.currentProductService.getProduct();
  qualifiedProductOffering$: Observable<TmaProductOfferingQualificationItem[]>;
  cartQualifiedProductOffering$: Observable<TmaProductOfferingQualificationItem[]>;
  tmaProduct: TmaProduct;
  dependantProductNamesList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  productSpecificationDependency: string;
  eligibleSubscriptions: TmaSubscriptions[] = [];
  checked: boolean[] = [];
  selectedEligibleSubscription: TmaSubscriptions;
  cartItemSelectedEligibleSubscription: TmaSubscriptions;
  relatedPlace: RelatedPlaceRef;
  installationAddress: Observable<GeographicAddress>;
  subscriptionsInstallationAddress: Map<string, GeographicAddress> = new Map();
  subscriptionsInstallationAddress$: Observable<Map<string, GeographicAddress>>;

  cartShowEdit?: boolean = true;
  showContinue?: boolean = true;

  protected subscription = new Subscription();
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected dependentBundle: TmaProduct;

  constructor(
    protected currentProductService: CurrentProductService,
    protected cd: ChangeDetectorRef,
    protected selfCareService: SelfcareService,
    protected globalMessageService: GlobalMessageService,
    protected translationService: TranslationService,
    protected baseSiteService: BaseSiteService,
    protected productService: ProductService,
    protected checkCpiProductQualificationService: CheckCpiProductQualificationService,
    protected checkProductOfferingQualificationService: CheckProductOfferingQualificationService,
    protected geographicAddressService: GeographicAddressService,
    protected userAccountFacade: UserAccountFacade,
    protected tmaTmfCartService: TmaTmfCartService,
    protected tmaAddToCartService: TmaAddToCartService,
    protected store: Store<TmaChecklistActionsState>,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected routing: RoutingService
  ) {
    this.currentProduct$ = this.currentProductService.getProduct();
    this.subscription.add(
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null),
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
    if (this.tmaItem !== undefined) {
      if (this.selectedEligibleSubscription === undefined && this.tmaItem.subscribedProduct !== undefined && this.tmaItem.subscribedProduct.productRelationship !== undefined) {
        this.subscription.add(
          this.selfCareService.getSubscribedProductBy(this.tmaItem.subscribedProduct.productRelationship[0].product.id)
            .subscribe(value => {
              this.selectedEligibleSubscription = value;
            })
        );

        this.installationAddress = this.geographicAddressService.getGeographicAddress(this.currentBaseSiteId, this.tmaItem.subscribedProduct.place[0].id);

        this.subscription.add(
          this.tmaChecklistActionService.getChecklistActionForProductCode(
            this.currentBaseSiteId,
            this.tmaItem.product.code,
            this.tmaItem.processType.id,
            true,
            !!this.installationAddress
          ).subscribe()
        );
      }
    }
    else {
      this.geographicAddressService.clearCreatedGeographicAddressState();
      this.subscription.add(
        this.currentProduct$
          .pipe(
            first((result: TmaProduct) => !!result)
          )
          .subscribe((result) => {
            this.tmaProduct = result;
            const payload = this.createProductOfferingQualification(result);
            this.qualifiedProductOffering$ = this.checkProductOfferingQualificationService.checkProductOfferingQualification(payload);
            this.subscription.add(
              this.qualifiedProductOffering$.subscribe(value => {
                if (value?.[0]?.eligibilityUnavailabilityReason?.length > 0) {

                  this.subscription.add(
                    this.tmaChecklistActionService.getChecklistActionForProductCode(
                      this.currentBaseSiteId,
                      this.tmaProduct.code,
                      undefined,
                      true
                    ).subscribe()
                  );

                  const dependantProductSpec = value?.[0].eligibilityUnavailabilityReason?.[0].label.split(' ').splice(-1)[0];
                  this.productSpecificationDependency = dependantProductSpec;
                  this.subscription.add(
                    this.checkCpiProductQualificationService.checkForProductSpecification(dependantProductSpec)
                      .subscribe(value1 => {
                        this.eligibleSubscriptions = value1;
                        this.eligibleSubscriptions.forEach((subscription: TmaSubscriptions) => {
                          this.subscription.add(
                            this.geographicAddressService.getGeographicAddress(this.currentBaseSiteId, subscription.place[0].id)
                              .pipe(
                                first((address: GeographicAddress) => address !== undefined)
                              )
                              .subscribe(address => {
                                address.relatedParty = [{ id: this.currentUser.customerId }];
                                this.subscriptionsInstallationAddress.set(subscription.id, address);
                                this.subscriptionsInstallationAddress$ = of(this.subscriptionsInstallationAddress);
                                this.cd.detectChanges();
                              })
                          );
                        });
                        this.cd.detectChanges();
                      })
                  );
                }
              })
            );
            if (DEPENDENT_BUNDLE[this.tmaProduct.code.toUpperCase()] !== undefined)
            {
              this.subscription.add(
                this.productService
                    .get(DEPENDENT_BUNDLE[this.tmaProduct.code.toUpperCase()])
                    .pipe(
                    filter(isNotNullable)
                    )
                    .subscribe((product: TmaProduct) => {
                  this.dependentBundle = product;
                })
              );
            }
          })
      );
    }
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.dependantProductNamesList$.complete();
    this.selfCareService.clearSubscriptionsState();
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.subscription?.unsubscribe();
  }

  /**
   * Redirects to the dependent bundle
   *
   * @product {@link TmaProduct} the dependent bundle
   */
  redirectToDependentBundle(product: TmaProduct) {
    this.tmaChecklistActionService.clearAllChecklistActionsState();
    const payload = this.createProductOfferingQualification(product);
    this.qualifiedProductOffering$ = this.checkProductOfferingQualificationService.checkProductOfferingQualification(payload);
    this.dependentBundle = null;
    this.showContinue = false;
    this.routing.go({
      cxRoute: PAGES.PRODUCT_PAGE,
      params: product,
    });
  }

  /**
   * Switches between eligible subscriptions or new plan
   *
   * @param eligibleSubscription a {@link TmaSubscription} from the customer CPI
   */
  toggleEligibleSubscription(eligibleSubscription: TmaSubscriptions) {
    if (eligibleSubscription === undefined) {
      this.geographicAddressService.clearCreatedGeographicAddressState();
      return;
    }

    this.selectedEligibleSubscription = eligibleSubscription;
    this.tmaAddToCartService.dependentProductId$.next(this.selectedEligibleSubscription.id);
    if (this.subscriptionsInstallationAddress.get(eligibleSubscription.id) !== undefined) {
      sessionStorage.setItem('Address', JSON.stringify(this.subscriptionsInstallationAddress.get(eligibleSubscription.id)));
      this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
        type: TmaChecklistActionType.INSTALLATION_ADDRESS,
        value: this.subscriptionsInstallationAddress.get(eligibleSubscription.id).id
      }]));
    }
  }

  switchFlags() {
    this.showEdit = !this.showEdit;
    this.tmaChecklistActionService.clearSelectedGeographicAddressState(this.tmaProduct.code);
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.showContinue = true;
  }

  showEditCartClicked() {
    this.cartShowEdit = !this.cartShowEdit;
    this.retrieveQualifiedSubscribedProducts();
  }

  continueToChecklistActions() {
    if (this.tmaItem === undefined) {
      this.showEdit = true;
      this.showContinue = false;

      if (this.selectedEligibleSubscription !== undefined) {
        this.geographicAddressService.setSelectedInstallationAddress(this.subscriptionsInstallationAddress.get(this.selectedEligibleSubscription.id));
        this.subscription.add(
          this.tmaChecklistActionService.getChecklistActionForProductCode(
            this.currentBaseSiteId,
            this.tmaProduct.code,
            undefined,
            undefined,
            true
          ).subscribe()
        );
      }
    }
  }

  retrieveQualifiedSubscribedProducts(): Observable<TmaProductOfferingQualificationItem[]> {
    const payload = this.createProductOfferingQualification(this.tmaItem.product);
    if (this.cartQualifiedProductOffering$ === undefined) {
      this.cartQualifiedProductOffering$ = this.checkProductOfferingQualificationService.checkProductOfferingQualification(payload);
      this.subscription.add(
        this.cartQualifiedProductOffering$.subscribe(value => {
          if (value?.[0]?.eligibilityUnavailabilityReason?.length > 0) {
            const dependantProductSpec = value?.[0].eligibilityUnavailabilityReason?.[0].label.split(' ').splice(-1)[0];
            this.productSpecificationDependency = dependantProductSpec;
            this.subscription.add(
              this.checkCpiProductQualificationService.checkForProductSpecification(dependantProductSpec)
                .subscribe(value1 => {
                  this.eligibleSubscriptions = value1;
                  this.eligibleSubscriptions.forEach((subscription: TmaSubscriptions) => {
                    this.subscription.add(
                      this.geographicAddressService.getGeographicAddress(this.currentBaseSiteId, subscription.place[0].id)
                        .pipe(
                          first((address: GeographicAddress) => address !== undefined)
                        )
                        .subscribe(address => {
                          address.relatedParty = [{ id: this.currentUser.customerId }];
                          this.subscriptionsInstallationAddress.set(subscription.id, address);
                          this.subscriptionsInstallationAddress$ = of(this.subscriptionsInstallationAddress);
                          this.cd.detectChanges();
                        })
                    );
                  });
                })
            );
          }
        })
      );
    }
    return this.cartQualifiedProductOffering$;
  }

  updateButton() {
    this.cartShowEdit = true;
    this.cartItemSelectedEligibleSubscription = this.selectedEligibleSubscription;
    if (this.tmaItem.subscribedProduct.productRelationship[0].product.id !== this.selectedEligibleSubscription.id) {
      this.tmaTmfCartService.updateCart(this.createCartPayload());
    }
  }

  cancelButton() {
    if (this.cartItemSelectedEligibleSubscription !== undefined) {
      this.selectedEligibleSubscription = this.cartItemSelectedEligibleSubscription;
    }
    this.cartShowEdit = true;
  }

  isCartOrOrderAndPurchaseWithAssurance() {
    return this.tmaItem !== undefined && this.tmaItem.subscribedProduct.productRelationship !== undefined && this.tmaItem.subscribedProduct.productRelationship[0].type === 'RELY_ON';
  }

  private createProductOfferingQualification(product: TmaProduct): TmaProductOfferingQualification {
    const productOfferingQualificationItems: TmaProductOfferingQualificationItem[] = [
      {
        id: '1',
        action: 'add',
        productOffering: {
          id: product.code
        }
      }];

    if(product?.children?.length > 0){
      product.children.forEach((childProduct: TmaProduct, index: number) => {
        const payload: TmaProductOfferingQualificationItem = {
          id: (index + 2).toString(),
          action: "add",
          qualificationItemRelationship: [{
            id: '1',
            relationshipType: "bundles"
          }],
          productOffering: {
            id: childProduct.code
          }
        };

        if(childProduct.productSpecification?.id){
          payload.product.productSpecification.id = childProduct.productSpecification.id;
        }

        productOfferingQualificationItems.push(payload);
      })
    }

    return {
      id: product.code,
      productOfferingQualificationItem: productOfferingQualificationItems
    };
  }

  private createCartPayload(): TmaTmfShoppingCart {
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: this.updateCartItems(),
      relatedParty: [
        {
          id: this.currentUser.customerId
        }
      ]
    };

    return shoppingCart;
  }

  private updateCartItems(): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      id: this.tmaItem.entryNumber.toString(),
      product: {
        productRelationship: [
          {
            product: {
              id: this.selectedEligibleSubscription.id,
              name: this.selectedEligibleSubscription.name
            },
            'type': TmaProductRelationshipType.RELY_ON
          }
        ],
        place: [
          {
            id: this.selectedEligibleSubscription.place[0].id,
            '@referredType': 'GeographicAddress',
            role: TmaPlaceRole.INSTALLATION_ADDRESS
          }
        ]
      }
    });
    return cartItemList;
  }
}
