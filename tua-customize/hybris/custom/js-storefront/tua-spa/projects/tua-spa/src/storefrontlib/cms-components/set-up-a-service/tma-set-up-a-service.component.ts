import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  GeographicAddress,
  GeographicAddressService,
  LOCAL_STORAGE,
  QueryServiceQualification,
  QueryServiceQualificationService,
  TmaActionType,
  TmaChecklistAction,
  TmaChecklistActionAction,
  TmaChecklistActionService,
  TmaChecklistActionType,
  TmaChecklistActionTypeCheckService,
  TmaChecklistActionsState,
  TmaCmsConsumptionComponent,
  TmaConstantResourceModel,
  TmaInstallationAddress,
  TmaPoSearchByConsumption,
  TmaProcessTypeEnum,
  TmaProductSearchService,
  TmaServiceProviderDetails,
  TmaTechnicalDetails,
  TmaTmfRelatedParty
} from '../../../core';
import { BehaviorSubject, Observable, Subscription, filter, first, take } from 'rxjs';
import {
  BaseSiteService,
  CmsService,
  Country,
  OCC_USER_ID_ANONYMOUS,
  ProductSearchPage,
  Region,
  User,
  UserAddressService,
  isNotNullable,
  PageMetaService,
  RoutingService,
} from '@spartacus/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { TmaAddressFormComponent } from '../address-form';
import { TmaTechnicalIdFormComponent } from '../technical-id-form';
import { TmaPoSearchByConsumptionComponent } from '../consumption';
import { TmaPurchaseReasonComponent } from '../purchase-reason';
import { Store } from '@ngrx/store';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { TmaAddToCartService } from '../../../core/add-to-cart';

const { REASON_FOR_PURCHASE, PAGES, INSTALLATION_ADDRESS } = LOCAL_STORAGE;
const { RELEVANCE, ALL_CATEGORIES } = LOCAL_STORAGE.SEARCH;
@Component({
  selector: 'cx-set-up-a-service',
  templateUrl: './tma-set-up-a-service.component.html',
  styleUrls: ['./tma-set-up-a-service.component.scss'],
})
export class SetUpAServiceComponent implements OnInit, AfterViewChecked, OnDestroy {

  data$: Observable<TmaCmsConsumptionComponent>;
  url$: Observable<UrlSegment[]>;
  queryParams$: Observable<Params>;
  checklistActions$: Observable<TmaChecklistAction[]>;
  poConsumptionComponents: TmaPoSearchByConsumption[];
  selectedDivision: string;
  displayForm$: Observable<boolean>;
  installationAddress: TmaInstallationAddress;
  technicalDetails: TmaTechnicalDetails;
  contractStartDate: string;
  serviceProvider: string;
  country$: Observable<Country>;
  selectedRegion: Region;


  @ViewChild(TmaPoSearchByConsumptionComponent)
  consumptionComponent: TmaPoSearchByConsumptionComponent;

  @ViewChild(TmaTechnicalIdFormComponent)
  technicalIdComponent: TmaTechnicalIdFormComponent;

  @ViewChild(TmaPurchaseReasonComponent)
  purchaseReasonComponent: TmaPurchaseReasonComponent;

  @ViewChild(TmaAddressFormComponent)
  addressComponent: TmaAddressFormComponent;

  protected selectedCountry$: BehaviorSubject<Country> = new BehaviorSubject<Country>({});
  protected selectedRegion$: BehaviorSubject<Region> = new BehaviorSubject<Region>({});
  protected baseSiteId: string;
  protected currentUser: User;
  protected subscription = new Subscription();
  protected selectedPurchaseReason: string;

  consumptionForm: FormGroup = this.fb.group({});
  technicalIdForm: FormGroup = this.fb.group({});
  purchaseReasonForm: FormGroup = this.fb.group({});
  installationAddressForm: FormGroup = this.fb.group({});

  constructor(
    public tmaChecklistActionTypeCheckService: TmaChecklistActionTypeCheckService,
    public geographicAddressService: GeographicAddressService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected baseSiteService: BaseSiteService,
    protected userAccountFacade: UserAccountFacade,
    protected userAddressService: UserAddressService,
    protected fb: FormBuilder,
    protected cmsService: CmsService,
    protected activatedRoute: ActivatedRoute,
    protected changeDetectorRef: ChangeDetectorRef,
    protected queryServiceQualificationService: QueryServiceQualificationService,
    protected store: Store<TmaChecklistActionsState>,
    protected datePipe: DatePipe,
    protected productSearchService: TmaProductSearchService,
    protected pageMetaService: PageMetaService,
    protected routingService: RoutingService,
    protected tmaAddToCartService: TmaAddToCartService
  ){

    this.subscription.add(
      this.baseSiteService.getActive()
        .subscribe((baseSiteId: string) => this.baseSiteId = baseSiteId)
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

  ngOnInit(): void {
    this.displayForm$ = this.pageMetaService.getMeta().pipe(filter(isNotNullable), map((meta) => meta.breadcrumbs.length === 1));
    this.subscription.add(
      this.cmsService.getComponentData('UtilitiesPoSearchByConsumptionComponentList')
        .pipe(first((component: TmaCmsConsumptionComponent) => component !== undefined))
        .subscribe((component:TmaCmsConsumptionComponent) => {
          this.poConsumptionComponents = Object.values(component.searchByConsumptionComponents);
          this.selectedDivision = this.poConsumptionComponents[0].name;
          return;
        })
    );
    this.url$ = this.activatedRoute.url;
    this.queryParams$ = this.activatedRoute.queryParams;
    this.productSearchService.search(':' + RELEVANCE + ALL_CATEGORIES + this.selectedDivision.charAt(0).toLowerCase() + this.selectedDivision.slice(1));
    this.subscription.add(
      this.productSearchService.getResults()
        .pipe(first((productSearchPage: ProductSearchPage) =>
          productSearchPage &&
          productSearchPage.products &&
          productSearchPage.products.length !== 0)
        )
        .subscribe((productSearchPage: ProductSearchPage) => {
          this.checklistActions$ = this.tmaChecklistActionService.getChecklistActionForProductCode(this.baseSiteId, productSearchPage.products[0].code);
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.tmaAddToCartService.clearAddToCartPayloadState();
    this.tmaChecklistActionService.clearChecklistActionWithAddToCartDetails();
    this.subscription?.unsubscribe();
  }

  /**
   * Switch between the division present in the from as radio inputs
   *
   * @param division - selected divion from radio input
   */
  changeDivision(division: string) {
    this.selectedDivision = division;
    this.store.dispatch(
      new TmaChecklistActionAction.ChecklistActionDetails(
        [{ type: TmaChecklistActionType.ESTIMATED_CONSUMPTION, value: { division: this.selectedDivision,
            consumption: this.consumptionComponent.consumptionForm['controls'].consumptionInput.value } }]
      )
    );
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
   * Gets the form consumption
   */
  getInputConsumption(consumptionForm: FormGroup): void {
    this.consumptionForm = consumptionForm;
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
   * Gets the form technical id
   */
  getInputPurchaseReason(purchaseReasonForm: FormGroup): void {
    this.purchaseReasonForm = purchaseReasonForm;
  }

  /**
   * Used for setting the reason of purchase based on the accessed page
   *
   * @param url - current page URL
   * @returns the purchase reason as a string
   */
  setPurchaseReason(url: UrlSegment[]): string {
    this.selectedPurchaseReason = url[0].path === PAGES.SWITCH_PROVIDER ? REASON_FOR_PURCHASE.SWITCH_PROVIDER : REASON_FOR_PURCHASE.MOVE;
    return this.selectedPurchaseReason;
  }

  storeDataAndViewProducts(): void {
    let invalidForm: boolean = false;

    if (this.consumptionComponent?.consumptionForm?.invalid) {
      this.markFormAsTouched(this.consumptionComponent.consumptionForm);
      invalidForm = true;
    }

    if (this.technicalIdComponent?.technicalDetails?.invalid) {
      this.markFormAsTouched(this.technicalIdComponent.technicalDetails);
      invalidForm = true;
    }

    if (this.purchaseReasonComponent?.purchaseReasonForm?.invalid) {
      this.markFormAsTouched(this.purchaseReasonComponent.purchaseReasonForm);
      invalidForm = true;
    }

    if (this.addressComponent?.installationAddress?.invalid) {
      this.markFormAsTouched(this.addressComponent.installationAddress);
      invalidForm = true;
    }

    if (invalidForm) {
      return;
    }

    this.queryServiceQualificationService.clearQueryServiceQualificationState();
    this.geographicAddressService.clearCreatedGeographicAddressState();
    const inputAddress = this.setRegion(this.getGeographicAddress());
    const technicalDetails = this.getTechnicalDetails();
    this.populateInstallationAddress();
    this.populateTechnicalDetails();
    this.populateContractStartDate();
    this.populateServiceProvider();
    this.saveReasonForPurchase();

    this.subscription.add(
      this.queryServiceQualificationService
        .getQueryServiceQualification(inputAddress, technicalDetails)
        .pipe(
          take(2),
          filter((res: QueryServiceQualification) => !!res)
        )
        .subscribe((res: QueryServiceQualification) => {
          this.geographicAddressService.createGeographicAddress(
            this.baseSiteId,
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
                if(this.selectedPurchaseReason === REASON_FOR_PURCHASE.SWITCH_PROVIDER){
                  this.routingService.go({ cxRoute: 'productCarouselSearchSwitchProvider' })
                } else{
                  this.routingService.go({ cxRoute: 'productCarouselSearch' })
                }
                this.changeDetectorRef.detectChanges();
              })
          );

        })
    );
  }

  private saveReasonForPurchase() {
    const serviceProviderPayload: TmaServiceProviderDetails = {
      contractDate: this.datePipe.transform(this.purchaseReasonForm.controls.contractStartDateInput.value, 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''),
      processType: TmaProcessTypeEnum.ACQUISITION,
      serviceProviderName: this.purchaseReasonForm.controls.previousProviderName?.value
    }
    this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
      type: TmaChecklistActionType.CONTRACT_START_DATE,
      value: serviceProviderPayload.contractDate
    }]));

    if (this.selectedPurchaseReason === REASON_FOR_PURCHASE.SWITCH_PROVIDER && serviceProviderPayload.serviceProviderName) {
      this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
        type: TmaChecklistActionType.SERVICE_PROVIDER,
        value: serviceProviderPayload.serviceProviderName
      }]));
    } else {
      this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails([{
        type: TmaChecklistActionType.SERVICE_PROVIDER,
        action: TmaActionType.REMOVE
      }]));
    }
  }

  protected markFormAsTouched(formGroup: FormGroup | FormControl): void {
    if (formGroup instanceof FormGroup) {
      Object.values(formGroup.controls).forEach((control: FormGroup) =>
        this.markFormAsTouched(control)
      );
    } else if (formGroup instanceof FormControl) {
      formGroup.markAsTouched()
    }
  }

  protected populateInstallationAddress(address?: GeographicAddress): void {
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

  protected populateTechnicalDetails(technicalResource?: TmaTechnicalDetails): void {
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

  protected populateContractStartDate(contractStartDate?: string): void {
    if (contractStartDate) {
      this.contractStartDate = contractStartDate;
      return;
    }
    this.contractStartDate = this.datePipe.transform(this.purchaseReasonForm.controls.contractStartDateInput.value, 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\'');
  }

  protected populateServiceProvider(serviceProvider?: string): void {
    if (serviceProvider) {
      this.serviceProvider = serviceProvider;
      return;
    }
    this.serviceProvider = this.purchaseReasonForm?.controls?.previousProviderName?.value;
  }

  protected getGeographicAddress(): GeographicAddress {
    const user: TmaTmfRelatedParty = {
      id: this.currentUser && this.currentUser.uid
        ? this.currentUser.uid
        : OCC_USER_ID_ANONYMOUS
    };
    this.geographicAddressService.clearGeographicAddressError();
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

  protected getTechnicalDetails(technicalId?: string): TmaTechnicalDetails {
    return technicalId ?
      {
        id: technicalId,
        type: this.selectedDivision
      } :
      {
        id: this.technicalIdForm['controls'].technicalId.value,
        type: this.selectedDivision
      };
  }

  private setRegion(selectedAddress: GeographicAddress): GeographicAddress {
    if (selectedAddress.country !== 'US') {
      selectedAddress.stateOfProvince = null;
    }
    return selectedAddress;
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


  protected isPurchaseReasonSwitchProvider(url: UrlSegment[]): boolean {
    return url[0].path === PAGES.SWITCH_PROVIDER
  }

  get constants(): TmaConstantResourceModel {
    return LOCAL_STORAGE;
  }
}
