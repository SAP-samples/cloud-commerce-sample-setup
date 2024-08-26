// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { TmaProduct } from '../../../../core/model/tma-product.model';
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseSiteService, Country, OCC_USER_ID_ANONYMOUS, ProductService, Region, User } from '@spartacus/core';
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
  TmaPlace,
  TmaTmfRelatedParty
} from '../../../../core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TmaAddressFormComponent } from '../../address-form';
import { filter, first, take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { ICON_TYPE, LAUNCH_CALLER, LaunchDialogService } from '@spartacus/storefront';
import { Store } from '@ngrx/store';

const { INSTALLATION_ADDRESS, TYPE } = LOCAL_STORAGE;

@Component({
  selector: 'cx-serviceability-form',
  templateUrl: './serviceability-form.component.html',
  styleUrls: ['./serviceability-form.component.scss']
})
export class ServiceabilityFormComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(TmaAddressFormComponent, {static: true})
  addressComponent!: TmaAddressFormComponent;

  @Input()
  simpleProductOffering: TmaProduct;

  @Input()
  bundleProductOffering: TmaProduct;

  @Input()
  currentAddress?: TmaPlace;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  iconTypes = ICON_TYPE;

  installationAddressDetails: FormGroup = this.fb.group({});
  installationAddress: TmaInstallationAddress;
  modalRef: any;
  serviceQualification: QueryServiceQualification;
  productNotServiceableError: boolean;
  productsNotServiceable: string[] = [];
  systemNotAvailable: boolean;
  addressError: boolean;
  errorForm: boolean = false;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<Country>({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<Region>({});
  protected subscription = new Subscription();
  protected currentBaseSiteId: string;
  protected currentUser: User;

  constructor(
    public geographicAddressService: GeographicAddressService,
    protected fb: FormBuilder,
    protected launchDialogService: LaunchDialogService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected spinner: NgxSpinnerService,
    protected baseSiteService: BaseSiteService,
    protected productService: ProductService,
    protected userAccountFacade: UserAccountFacade,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected vcr: ViewContainerRef,
    protected store: Store<TmaChecklistActionsState>,
    protected tmaChecklistActionService: TmaChecklistActionService
  ) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.launchDialogService.data$.subscribe((data) => {
        if (data !== undefined) {
          this.simpleProductOffering = data.simpleProductOffering;
          this.bundleProductOffering = data.bundleProductOffering;
        }
      })
    );
    this.spinner.hide();
    if (sessionStorage.getItem('Address')) {
      const sessionAddress: any = JSON.parse(sessionStorage.getItem('Address'));
      const country = JSON.parse(sessionStorage.getItem('Country'));
      let region;
      if (sessionStorage.getItem('Address')) {
        region = JSON.parse(sessionStorage.getItem('Region'));
      }
      this.installationAddress = {
        buildingNumber: sessionAddress.streetName.split(',')[0],
        streetName: sessionAddress.streetName.split(',')[1],
        apartmentNumber: sessionAddress.streetNr,
        city: sessionAddress.city,
        country: country,
        region: region,
        postalCode: sessionAddress.postcode
      };
    }
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => baseSiteId != null)
        )
        .subscribe((baseSiteId: string) => (this.currentBaseSiteId = baseSiteId))
    );

    this.subscription.add(
    this.userAccountFacade
      .get()
      .pipe(
        first((user: User) => user != null)
      )
      .subscribe((user: User) => (this.currentUser = user))
    );
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
  }

  ngAfterViewInit() {
    this.installationAddressDetails.addControl(
      'installationAddress',
      this.addressComponent.installationAddress
    );
    this.addressComponent.installationAddress.setParent(
      this.installationAddressDetails
    );
  }

  ngOnDestroy() {
    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.queryServiceQualificationService.clearQueryServiceSearchResultState();
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
    this.tmaChecklistActionService.clearAllChecklistActionsState();
    this.subscription?.unsubscribe();
  }

  /**
   * Sets up the isocode for the selected country
   *
   * @param country of {@link Country }
   */
  onCountrySelected(country: Country): void {
    sessionStorage.setItem('Country', JSON.stringify(country));
    this.selectedCountry$.next(country);
    this.selectedRegion$.next(null);
  }

  /**
   * Sets up the isocode for the selected region
   *
   * @param region of {@Link Region}
   */
  onRegionSelected(region: Region): void {
    sessionStorage.setItem('Region', JSON.stringify(region));
    this.selectedRegion$.next(region);
  }

  getInputAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: ''
    };
    user.id = this.currentUser ? this.currentUser.uid : OCC_USER_ID_ANONYMOUS;
    const address: GeographicAddress = {};
    address.relatedParty = [{
      id: user.id
    }];
    address.isShippingAddress = false;
    address.isInstallationAddress = true;
    address.streetName =
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
        ].buildingNumber.value +
      ',' +
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
        ].streetName.value;
    address.streetNr = this.installationAddressDetails[
      'controls'
      ].installationAddress['controls'].apartmentNumber.value;
    address.postcode = this.installationAddressDetails[
      'controls'
      ].installationAddress['controls'].postalCode.value;
    address.city = this.installationAddressDetails[
      'controls'
      ].installationAddress['controls'].city.value;
    address.stateOfProvince =
      this.installationAddressDetails['controls'].installationAddress[
        'controls'
        ].region.value['isocode'] !== null
        ? this.installationAddressDetails['controls'].installationAddress[
          'controls'
          ].region.value['isocode']
        : null;
    address.country = this.installationAddressDetails[
      'controls'
      ].installationAddress['controls'].country.value['isocode'];
    return address;
  }

  closeModal(reason?: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  /**
   * Performs the serviceability check for the product offering, if the product offering is serviceable
   * at provided installation address then it product details dialog component is rendered else error will be displayed
   */
  protected checkServiceability(): void {
    this.spinner.show();
    const inputAddress = this.checkRegion(this.getInputAddress());
    this.queryServiceQualificationService.createQueryServiceQualification(
      inputAddress
    );
    this.geographicAddressService.clearCreatedGeographicAddressState();
    this.subscription.add(
      this.queryServiceQualificationService
        .getQueryServiceQualification(inputAddress)
        .pipe(
          take(2),
          filter((res: QueryServiceQualification) => !!res)
        )
        .subscribe((res: QueryServiceQualification) => {
          this.serviceQualification = res;
          if (this.serviceQualification.serviceQualificationItem) {
            this.queryServiceQualificationService.getResultsFromQueryServiceQualification(
              this.serviceQualification
            );
            const productList = [];

            productList.push(this.simpleProductOffering.code);
            this.subscription.add(
              this.queryServiceQualificationService
                .getNonServiceableProductOfferings(productList)
                .pipe(
                  take(2),
                  filter((result: string[]) => !!result)
                )
                .subscribe((productOfferings: string[]) => {
                  if (!!productOfferings) {
                    if (productOfferings.length > 0) {
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
                                result[TYPE.VALUE] === INSTALLATION_ADDRESS.GEOGRAPHIC_ADDRESS
                            )
                          )
                          .subscribe((result: GeographicAddress) => {
                            this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
                              type: TmaChecklistActionType.INSTALLATION_ADDRESS,
                              value: {installationAddressId: result.id}
                            }]));
                          })
                      );
                      this.productsNotServiceable.push(this.simpleProductOffering.name);
                      this.productNotServiceableError = true;
                      this.errorForm = true;
                      this.spinner.hide();
                      return;
                    }
                    this.openProductDetailsDialog();
                    this.changeDetectorRef.detectChanges();
                  }
                })
            );

          } else {
            this.productsNotServiceable.push(this.simpleProductOffering.name);
            this.productNotServiceableError = true;
            this.errorForm = true;
            this.spinner.hide();
            this.changeDetectorRef.detectChanges();
          }
        })
    );
    this.subscription.add(
      this.queryServiceQualificationService
        .hasQueryServiceQualificationError()
        .pipe(
          take(2),
          filter((result: boolean) => result != null && result),
        )
        .subscribe((result: boolean) => {
          this.spinner.hide();
          this.systemNotAvailable = result;
          this.errorForm = true;
        })
    );
  }

  private openProductDetailsDialog() {
    this.closeModal();
    this.spinner.hide();
    const modalInstanceData = {
      simpleProductOffering: this.simpleProductOffering,
    };
    if (this.bundleProductOffering !== undefined) {
      modalInstanceData['bundleProductOffering'] = this.bundleProductOffering;
    }
    const dialog = this.launchDialogService.openDialog(
      LAUNCH_CALLER.PRODUCT_DETAILS_DIALOG,
      undefined,
      this.vcr,
      modalInstanceData
    );
    if (dialog) {
      dialog.pipe(take(1)).subscribe();
    }
  }

  private checkRegion(selectedAddress) {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }
}
