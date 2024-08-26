// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

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
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseSiteService, Country, ProductService, Region, User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import {
  GeographicAddress,
  GeographicAddressService,
  QueryServiceQualification,
  QueryServiceQualificationService,
  TmaInstallationAddress,
  TmaPlace,
  TmaProductListComponentService,
  TmaTmfRelatedParty
} from '../../../../core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { TmaAddressFormComponent } from '../../address-form';
import { filter, first, take, takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { LaunchDialogService } from '@spartacus/storefront';

@Component({
  selector: 'lib-serviceability-category-form',
  templateUrl: './serviceability-category-form.component.html',
  styleUrls: ['./serviceability-category-form.component.scss']
})
export class ServiceabilityCategoryFormComponent
  implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild(TmaAddressFormComponent, { static: true })
  addressComponent!: TmaAddressFormComponent;

  @Input()
  simpleProductOffering: Map<string, string>;

  @Input()
  bundleProductOffering: Map<string, string>;

  @Input()
  currentAddress?: TmaPlace;

  @Output()
  addressForm = new EventEmitter<FormGroup>();

  installationAddressDetails: FormGroup = this.fb.group({});
  installationAddress: TmaInstallationAddress;
  serviceQualification: QueryServiceQualification;
  productNotServiceableError: boolean;
  productsNotServiceable: string[] = [];
  systemNotAvailable: boolean = false;
  addressError: boolean;
  errorForm: boolean = false;
  hasError: boolean;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<
    Country
  >({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<
    Region
  >({});
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
    protected tmaProductListComponentService?: TmaProductListComponentService
  ) {}

  ngOnInit(): void {
    this.spinner.hide();
    this.subscription.add(
      this.queryServiceQualificationService.getQueryServiceQualificationInCategoryPage()
        .subscribe((serviceQualification: QueryServiceQualification) => {
          const address = serviceQualification?.address[0];
          if (address) {
            this.installationAddress = {
              buildingNumber: address.streetName.split(',')[0],
              streetName: address.streetName.split(',')[1],
              apartmentNumber: address.streetNr,
              city: address.city,
              country: {
                isocode: address.country,
              },
              postalCode: address.postcode
            };
          }
      })
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
      this.userAccountFacade
        .get()
        .pipe(
          first((user: User) => user != null)
        )
        .subscribe((user: User) => (this.currentUser = user))
    );
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
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
    this.queryServiceQualificationService.clearQueryServiceQualificationErrorState();
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
    user.id = this.currentUser ? this.currentUser.uid : '';
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

  closeModal(reason: any): void {
    this.launchDialogService.closeDialog(reason);
  }

  /**
   * Performs the following
   *
   * - Clears the address stored in session storage
   * - Gets the address from input address and sets in session storage
   * - Service qualification call for input address
   * - Check if the service qualification system is available
   * - Performs the product search
   */
  checkServiceability(): void {
      const inputAddress = this.checkRegion(this.getInputAddress());
      this.queryServiceQualificationService.createQueryServiceQualification(
        inputAddress,undefined, true
      );
      this.subscription.add(
        this.queryServiceQualificationService
          .hasQueryServiceQualificationError()
          .pipe(
            take(2),
            filter((result: boolean) => result != null)
          )
          .subscribe((result: boolean) => {
          if (result) {
            this.systemNotAvailable = result;
          } else {
            this.queryServiceQualificationService.selectedInstallationAddress(
              inputAddress
            );
            this.closeModal('Cross click');
            this.tmaProductListComponentService.getProductSearch();
          }
        })
      );
  }

  private checkRegion(selectedAddress) {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
  }
}