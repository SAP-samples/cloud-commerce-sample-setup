// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { BaseSiteService, Country, OCC_USER_ID_ANONYMOUS, Region, User, UserAddressService } from '@spartacus/core';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  GeographicAddress,
  GeographicAddressService,
  LOCAL_STORAGE,
  QueryServiceQualification,
  QueryServiceQualificationService,
  TmaChecklistActionAction,
  TmaChecklistActionService,
  TmaChecklistActionsState,
  TmaChecklistActionType,
  TmaInstallationAddress,
  TmaOrderEntry,
  TmaPlace,
  TmaPlaceRole,
  TmaProduct,
  TmaProductService,
  TmaTechnicalDetails,
  TmaTmfCartItem,
  TmaTmfCartService,
  TmaTmfRelatedParty,
  TmaTmfShoppingCart
} from '../../../../core';
import { filter, first, take } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TmaAddressFormComponent } from '../../address-form';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { TmaTechnicalIdFormComponent } from '../../technical-id-form';
import { CurrentProductService } from '@spartacus/storefront';

const { INSTALLATION_ADDRESS } = LOCAL_STORAGE;
const { TECHNICAL_ID } = LOCAL_STORAGE.SUBSCRIBED_PRODUCT.CHARACTERISTIC;
const { DEPENDENT_PRODUCT_AND_INSTALLATION_ADDRESS_ARE_SET } = LOCAL_STORAGE.DEPENDENT_PRODUCT;

@Component({
  selector: 'cx-checklist-installation-address',
  templateUrl:
    './checklist-installation-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistInstallationAddressComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input()
  item?: TmaOrderEntry;

  @Input()
  detailedPlace?: GeographicAddress;

  @Input()
  productCode?: string;

  @Input()
  tmaProduct?: TmaProduct;

  @Input()
  isInstallationAddress?: boolean;

  @Input()
  showEdit?: boolean;

  @Input()
  currentAddress: any;

  @ViewChild(TmaAddressFormComponent)
  addressComponent: TmaAddressFormComponent;

  @ViewChild(TmaTechnicalIdFormComponent)
  technicalIdComponent: TmaTechnicalIdFormComponent;

  isEdit: boolean = false;
  showSelect: boolean = true;
  installationAddressForm: FormGroup = this.fb.group({});
  technicalIdForm: FormGroup = this.fb.group({});
  country$: Observable<Country>;
  selectedRegion: Region;
  installationAddress: TmaInstallationAddress;
  technicalDetails: TmaTechnicalDetails;
  displayChecklist$: Observable<string>;
  currentProductId: string;

  protected subscription = new Subscription();
  protected addressError: boolean;
  protected currentUser: User;
  protected currentBaseSiteId: string;
  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<Country>({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<Region>({});

  constructor(
    public geographicAddressService: GeographicAddressService,
    protected productService: TmaProductService,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected userAccountFacade: UserAccountFacade,
    protected baseSiteService: BaseSiteService,
    protected userAddressService: UserAddressService,
    protected tmaTmfCartService: TmaTmfCartService,
    protected fb: FormBuilder,
    protected store: Store<TmaChecklistActionsState>,
    private changeDetectorRef: ChangeDetectorRef,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected currentProductService: CurrentProductService
  ) {
    this.subscription.add(
      this.currentProductService.getProduct()
        .pipe(
          filter((product) => !!product)
        )
        .subscribe(product => {
            this.currentProductId = product.code;
          }
        )
    );
  }

  ngOnInit(): void {
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
    this.userAddressService.loadDeliveryCountries();
    let addressFromServiceQualification;
    this.subscription.add(
      this.queryServiceQualificationService.getQueryServiceQualificationInCategoryPage()
        .subscribe((serviceQualification: QueryServiceQualification) => {
        if (serviceQualification) {
          const address = serviceQualification?.address[0];
          if (address) {
            addressFromServiceQualification = address;
          }
        }
      })
    );
    if (this.item) {
      if (this.item.subscribedProduct && this.item.subscribedProduct.productRelationship !== undefined) {
        this.showEdit = false;
      }
      const itemPlaceId: string = this.item.subscribedProduct?.place !== undefined ? this.item.subscribedProduct?.place[0]?.id : undefined;
      this.subscription.add(
        this.geographicAddressService.getGeographicAddress(this.currentBaseSiteId, itemPlaceId)
          .pipe(
            first((address: GeographicAddress) => address !== null)
          )
          .subscribe((address: GeographicAddress) => {
            this.populateInstallationAddress(address);
          })
      );
    } else if (addressFromServiceQualification) {
      if (addressFromServiceQualification.stateOfProvince) {
        this.userAddressService.loadRegions(addressFromServiceQualification.country);
      }
      this.populateInstallationAddress(addressFromServiceQualification);
      const geoGraphicAddress: GeographicAddress = {
        ...addressFromServiceQualification,
        isInstallationAddress: true,
        relatedParty: [
          {id: this.currentUser.uid}
        ]
      }
      this.geographicAddressService.clearCreatedGeographicAddressState();
      this.selectedRegion = JSON.parse(sessionStorage.getItem('Region'));
      this.subscription.add(
        this.queryServiceQualificationService
          .getNonServiceableProductOfferings([this.tmaProduct.code])
          .pipe(
            take(2),
            filter((result: string[]) => !!result)
          )
          .subscribe(productOfferingResults => {
            if (!!productOfferingResults && this.item === undefined) {
              this.geographicAddressService.createGeographicAddress(
                this.currentBaseSiteId,
                geoGraphicAddress
              );
              this.subscription.add(
                this.geographicAddressService
                  .getSelectedInstallationAddress()
                  .pipe(take(2),
                    filter(
                      (result: GeographicAddress) =>
                        Object.keys(result).length !== 0 &&
                        result['@type'] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS
                    )
                  )
                  .subscribe((result: GeographicAddress) => {
                    this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
                      type: TmaChecklistActionType.INSTALLATION_ADDRESS,
                      value: {installationAddressId: result.id}
                    }]));
                    this.isEdit = false;
                    this.changeDetectorRef.detectChanges();
                  })
              );
            }
          })
      );
    }

    if (this.currentProductId === undefined) {
      this.currentProductId = this.item?.product?.code;
    }

    this.subscription.add(
      this.getDisplayChecklists(this.currentProductId).subscribe(value => {
        if (value === DEPENDENT_PRODUCT_AND_INSTALLATION_ADDRESS_ARE_SET) {
          this.showEdit = false;
        }
      })
    );

    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.geographicAddressService.clearGeographicAddressError();
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
    this.subscription?.unsubscribe();
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  /**
   * Toggle the address form
   */
  displayAddressForm() {
    this.showSelect = false;
    this.isEdit = !this.isEdit;
  }

  /**
   * Sets up the isocode for the selected country
   *
   * @param country - the selected country
   */
  onCountrySelected(country: Country): void {
    sessionStorage.removeItem('Region');
    sessionStorage.setItem('Country', JSON.stringify(country));
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
   * Sets up the isocode for the selected region
   *
   * @param region - the selected region
   */
  onRegionSelected(region: Region): void {
    sessionStorage.setItem('Region', JSON.stringify(region));
    this.selectedRegion$.next(region);
  }

  /**
   * Gets country installation address
   */
  getCountry(isoCode: string): void {
    this.country$ = this.userAddressService.getCountry(isoCode);
  }

  /**
   * Gets region installation address
   */
  getRegion(stateOfProvince: string): void {
    this.subscription.add(
      this.userAddressService.getRegions(this.installationAddress.country.isocode)
        .pipe(
          first((regions: Region[]) => regions.length !== 0)
        )
        .subscribe((regions: Region[]) => {
          this.selectedRegion = regions.filter((region: Region) => region.isocode === stateOfProvince)[0];
        })
    );
  }

  /**
   * Gets the form installation address
   */
  getInputAddress(addressForm: FormGroup): void {
    this.installationAddressForm = addressForm;
  }

  /**
   * Gets the form technical id
   */
  getInputTechnicalDetails(technicalIdForm: FormGroup): void {
    this.technicalIdForm = technicalIdForm;
  }

  /**
   * Populate the installation address for the address component
   */
  populateInstallationAddress(address?: GeographicAddress): void {
    if (address) {
      const result = this.splitStreetAddress(address);
      const country: Country = !address.countryName ? JSON.parse(sessionStorage.getItem('Country')) as Country : undefined;
      const region: Region = JSON.parse(sessionStorage.getItem('Region')) as Region
      this.installationAddress = {
        streetName: result.streetName,
        buildingNumber: result.buildingNumber,
        apartmentNumber: address.streetNr,
        city: address.city,
        postalCode: address.postcode,
        country: {
          isocode: address.country,
          name: address.countryName ? address.countryName : country.name
        },
        region: region
      };
      return;
    }
    this.installationAddress = {
      streetName: this.installationAddressForm['controls'].streetName.value,
      buildingNumber: this.installationAddressForm['controls'].buildingNumber.value,
      apartmentNumber: this.installationAddressForm['controls'].apartmentNumber.value,
      city: this.installationAddressForm['controls'].city.value,
      postalCode: this.installationAddressForm['controls'].postalCode.value,
      country: this.installationAddressForm['controls'].country.value,
      region: this.installationAddressForm['controls'].region.value
    };
  }

  checkForInstallationAddress(): GeographicAddress | TmaPlace {
    if (this.detailedPlace && this.item) {
      return this.detailedPlace;
    }
    let selectedAddress: GeographicAddress = undefined;
    this.subscription.add(
      this.geographicAddressService.getSelectedInstallationAddress()
        .pipe(
          first((address: GeographicAddress) => address !== null)
        )
        .subscribe((address: GeographicAddress) => {
          selectedAddress = address;
        })
    );
    if (!selectedAddress || Object.keys(selectedAddress).length === 0) {
      return JSON.parse(sessionStorage.getItem('Address')) as GeographicAddress;
    }
    return selectedAddress;
  }


  /**
   * Populate the technical details for the address component
   */
  populateTechnicalDetails(technicalResource?: TmaTechnicalDetails): void {
    if (technicalResource) {
      this.technicalDetails = {
        id: technicalResource.id,
        type: technicalResource?.type
      };
      return;
    }
    this.technicalDetails = {
      id: this.technicalIdForm['controls'].technicalId.value,
    };
  }

  checkForTechnicalId(item?: TmaOrderEntry): boolean {
    if (item !== undefined && item.subscribedProduct !== null && item.subscribedProduct.characteristic !== null) {
      this.technicalDetails = {
        id: item.subscribedProduct?.characteristic?.find(value => value.name === TECHNICAL_ID)?.value.toString()
      }
      return !!item.subscribedProduct?.characteristic?.find(value => value.name === TECHNICAL_ID)?.value;
    }
    if (this.tmaProduct && this.tmaProduct.productSpecification && this.tmaProduct.productSpecification.id) {
      return this.productService.isProductSpecificationForViewDetails(this.tmaProduct.productSpecification.id);
    }
    return false;
  }

  getDisplayChecklists(productCode: string): Observable<string> {
    return this.tmaChecklistActionService.getCurrentViewForDependentProduct(productCode);
  }

  /**
   * Saves the address in the session storage and in the store statement
   */
  saveAddress(): void {

    if (this.addressComponent.installationAddress.invalid) {
      this.markAddressFormAsTouched(this.addressComponent.installationAddress);
      return;
    }

    if (this.technicalIdComponent?.technicalDetails?.invalid && this.checkForTechnicalId(this.item)) {
      this.markTechnicalIdFormAsTouched(this.technicalIdComponent.technicalDetails);
      return;
    }
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.geographicAddressService.clearCreatedGeographicAddressState();
    const inputAddress = this.setRegion(this.getGeographicAddress());
    let technicalDetails;
    this.populateInstallationAddress();
    if (this.checkForTechnicalId(this.item)) {
      this.populateTechnicalDetails();
      technicalDetails = this.getTechnicalDetails();
    }
    let productOfferings: string[] = [];
    let product: TmaProduct;
    if (this.item && this.item.product) {
      product = this.item.product;
    } else {
      product = this.tmaProduct;
    }
    if (product.isBundle) {
      productOfferings = this.tmaProduct.children.map((child: TmaProduct) => {
        return child.code;
      });
    } else {
      productOfferings.push(product.code);
    }
    this.subscription.add(
      this.queryServiceQualificationService
        .getQueryServiceQualification(inputAddress, technicalDetails)
        .pipe(
          take(2),
          filter((res: QueryServiceQualification) => !!res)
        )
        .subscribe((res: QueryServiceQualification) => {
          if (res.serviceQualificationItem) {
            this.subscription.add(
              this.queryServiceQualificationService
                .getNonServiceableProductOfferings(productOfferings)
                .pipe(
                  take(2),
                  filter((result: string[]) => !!result)
                )
                .subscribe(productOfferingResults => {
                  if (!!productOfferingResults) {
                    if (this.item === undefined) {
                      this.geographicAddressService.createGeographicAddress(
                        this.currentBaseSiteId,
                        inputAddress
                      );
                      this.subscription.add(
                        this.geographicAddressService
                          .getSelectedInstallationAddress()
                          .pipe(take(2),
                            filter(
                              (result: GeographicAddress) =>
                                Object.keys(result).length !== 0 &&
                                result['@type'] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS
                            )
                          )
                          .subscribe((result: GeographicAddress) => {
                            this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
                              type: TmaChecklistActionType.INSTALLATION_ADDRESS,
                              value: {installationAddressId: result.id}
                            }]));
                            this.isEdit = false;
                            this.changeDetectorRef.detectChanges();
                          })
                      );
                    } else {
                      if (this.isEdit && this.detailedPlace?.id) {
                        this.geographicAddressService.updateGeographicAddress(
                          this.currentBaseSiteId,
                          this.detailedPlace.id,
                          inputAddress
                        );
                      } else {
                        this.geographicAddressService.createGeographicAddress(
                          this.currentBaseSiteId,
                          inputAddress
                        );
                      }
                      this.subscription.add(
                        this.geographicAddressService
                          .hasGeographicAddressError()
                          .pipe(
                            take(2),
                            filter((result: boolean) => result != null && result)
                          )
                          .subscribe((result: boolean) => {
                            this.addressError = result;
                          })
                      );

                      this.subscription.add(
                        this.geographicAddressService
                          .getSelectedInstallationAddress()
                          .pipe(
                            take(2),
                            filter(
                              (result: GeographicAddress) =>
                                Object.keys(result).length !== 0
                            )
                          )
                          .subscribe((result: GeographicAddress) => {
                            this.updateCart(result.id);
                          })
                      );
                    }
                  }
                })
            );
          } else {
            if (res.technicalResources.length) {
              if (this.item === undefined) {
                this.geographicAddressService.createGeographicAddress(
                  this.currentBaseSiteId,
                  inputAddress
                );
                this.subscription.add(
                  this.geographicAddressService
                    .getSelectedInstallationAddress()
                    .pipe(take(2),
                      filter(
                        (result: GeographicAddress) =>
                          Object.keys(result).length !== 0 &&
                          result['@type'] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS
                      )
                    )
                    .subscribe((result: GeographicAddress) => {
                      this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails(
                        [{
                          type: TmaChecklistActionType.INSTALLATION_ADDRESS,
                          value: {installationAddressId: result.id, technicalId: res.technicalResources[0].id}
                        }]));
                      this.isEdit = false;
                      this.changeDetectorRef.detectChanges();
                    })
                );
              } else {
                if (this.isEdit && this.detailedPlace.id) {
                  this.geographicAddressService.updateGeographicAddress(
                    this.currentBaseSiteId,
                    this.detailedPlace.id,
                    inputAddress
                  );
                  const shoppingCart: TmaTmfShoppingCart = {
                    baseSiteId: this.currentBaseSiteId,
                    cartItem: [
                      {
                        id: this.item.entryNumber.toString(),
                        product: {
                          characteristic: [
                            {
                              name: TECHNICAL_ID,
                              value: technicalDetails.id
                            }
                          ]
                        }
                      }
                    ],
                    relatedParty: [
                      {
                        id: this.getCurrentUserId()
                      }
                    ]
                  };

                  this.tmaTmfCartService.updateCart(shoppingCart);
                }
              }
            }
          }
        })
    );
  }

  private getCurrentUserId(): string {
    return this.currentUser && this.currentUser.uid
      ? this.currentUser.uid
      : OCC_USER_ID_ANONYMOUS
  }

  protected markAddressFormAsTouched(formGroup: FormGroup | FormControl): void {
    if (formGroup instanceof FormGroup) {
      Object.values(formGroup.controls).forEach((control: FormGroup) =>
        this.markAddressFormAsTouched(control)
      );
    } else if (formGroup instanceof FormControl) {
      formGroup.markAsTouched()
    }
  }

  protected markTechnicalIdFormAsTouched(formGroup: FormGroup | FormControl): void {
    if (formGroup instanceof FormGroup) {
      Object.values(formGroup.controls).forEach((control: FormGroup) =>
        this.markTechnicalIdFormAsTouched(control)
      );
    } else if (formGroup instanceof FormControl) {
      formGroup.markAsTouched()
    }
  }

  protected getGeographicAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: ''
    };
    this.addressError = false;
    this.geographicAddressService.clearGeographicAddressError();
    user.id = this.currentUser && this.currentUser.uid
      ? this.currentUser.uid
      : OCC_USER_ID_ANONYMOUS;
    const address: GeographicAddress = {};
    address.relatedParty = [{
      id: user.id
    }];
    address.isShippingAddress = false;
    address.isInstallationAddress = true;
    address.streetName =
      this.installationAddressForm[
        'controls'
        ].buildingNumber.value +
      ',' +
      this.installationAddressForm[
        'controls'
        ].streetName.value;
    address.streetNr = this.installationAddressForm['controls'].apartmentNumber.value;
    address.postcode = this.installationAddressForm['controls'].postalCode.value;
    address.city = this.installationAddressForm['controls'].city.value;
    address.stateOfProvince =
      this.installationAddressForm[
        'controls'
        ].region.value['isocode'] !== null
        ? this.installationAddressForm[
          'controls'
          ].region.value['isocode']
        : null;
    address.country = this.installationAddressForm['controls'].country.value['isocode'];
    return address;
  }

  protected getTechnicalDetails(): TmaTechnicalDetails {
    return {
      id: this.technicalIdForm['controls'].technicalId.value,
      type: this.tmaProduct.categories[0].code
    };
  }

  protected splitStreetAddress(address: GeographicAddress): { streetName: string, buildingNumber: string } {
    let streetName = '';
    let buildingNumber = '';
    const cleanedAddressString = address.streetName.replace(/,/g, ' ');
    const addressStreetAndNumber = cleanedAddressString.match(/^(\d+[a-zA-Z]*|[a-zA-Z]+)(.*)$/);
    if (addressStreetAndNumber) {
      addressStreetAndNumber.forEach((result: string) => {
        if (/\d/.test(result)) {
          buildingNumber = result;
        } else {
          streetName = result.trim();
        }
      });
    }
    return {streetName, buildingNumber};
  }

  private setRegion(selectedAddress: GeographicAddress): GeographicAddress {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }

  protected updateCart(installationAddress: string): void {
    const currentUserId: string =
      this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS;
    const shoppingCart: TmaTmfShoppingCart = {
      baseSiteId: this.currentBaseSiteId,
      cartItem: this.updateCartItems(installationAddress),
      relatedParty: [
        {
          id: currentUserId
        }
      ]
    };
    this.tmaTmfCartService.updateCart(shoppingCart);
  }

  protected updateCartItems(installationAddress: string): TmaTmfCartItem[] {
    const cartItemList: TmaTmfCartItem[] = [];
    cartItemList.push({
      id: this.item.entryNumber.toString(),
      product: {
        place: [
          {
            id: installationAddress,
            '@referredType': 'GeographicAddress',
            role: TmaPlaceRole.INSTALLATION_ADDRESS
          }
        ]
      }
    });
    return cartItemList;
  }
}
