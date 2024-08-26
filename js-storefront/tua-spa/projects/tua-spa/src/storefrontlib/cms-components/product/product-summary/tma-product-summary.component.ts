// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { CmsService, ContentSlotComponentData, CurrencyService, Page } from '@spartacus/core';
import { CurrentProductService, ProductSummaryComponent } from '@spartacus/storefront';
import {
  TmaBillingFrequencyConfig,
  TmaBillingFrequencyMap,
  TmaChecklistActionAction,
  TmaChecklistActionsState,
  TmaChecklistActionType,
  TmaConsumptionConfig
} from '../../../../core';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { SEPARATOR, TmaCmsConsumptionComponent, TmaConsumptionValue, TmaProduct, TmaUsageUnit } from '../../../../core/model';
import { TmaPriceService, TmaProductService } from '../../../../core/product/facade';
import { Store } from '@ngrx/store';

@Component({
  selector: 'cx-product-summary',
  templateUrl: './tma-product-summary.component.html',
  styleUrls: ['./tma-product-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductSummaryComponent extends ProductSummaryComponent implements OnInit, OnDestroy {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;

  product$: Observable<TmaProduct>;
  url$: Observable<UrlSegment[]>;
  page$: Observable<Page>;
  currency$: Observable<string>;
  discount: number;

  protected consumption: number;
  private subscription = new Subscription();

  constructor(
    public priceService: TmaPriceService,
    protected currentProductService: CurrentProductService,
    protected store: Store<TmaChecklistActionsState>,
    protected tmaProductService?: TmaProductService,
    protected activatedRoute?: ActivatedRoute,
    protected cmsService?: CmsService,
    protected consumptionConfig?: TmaConsumptionConfig,
    protected currencyService?: CurrencyService,
    protected billingFrequencyConfig?: TmaBillingFrequencyConfig
  ) {
    super(currentProductService);
  }

  ngOnInit(): void {
    this.url$ = this.activatedRoute.url;
    this.page$ = this.cmsService.getCurrentPage();
    this.currency$ = this.currencyService.getActive();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  availableDiscount(discounts: number): void {
    this.discount = discounts;
  }

  /**
   * Retrieves the consumption component based on the product's product specification
   *
   * @param page The current page
   * @param product The provided product
   * @return The consumption component as {@link TmaCmsConsumptionComponent}
   */
  getConsumptionComponent(page: Page, product: TmaProduct): TmaCmsConsumptionComponent {
    const consumptionSlotKey: string = Object.keys(page.slots)
      .find((key: string) => page.slots[key].components.find((component: ContentSlotComponentData) => component.typeCode === 'ConsumptionListComponent'));

    if (!consumptionSlotKey) {
      return null;
    }

    const consumptionSlot = page.slots[consumptionSlotKey];

    const consumptionComponentList: TmaCmsConsumptionComponent[] = [];
    consumptionSlot.components.forEach((component: ContentSlotComponentData) => {
      this.cmsService.getComponentData(component.uid)
        .pipe(first((consumptionComp: TmaCmsConsumptionComponent) => consumptionComp != null))
        .subscribe((consumptionComp: TmaCmsConsumptionComponent) => consumptionComponentList.push(consumptionComp));
    });

    if (!consumptionComponentList || consumptionComponentList.length === 0) {
      return null;
    }

    const keyValueList: string[] = Object.keys(consumptionComponentList[0].searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return null;
    }

    const consumptionComponent: TmaCmsConsumptionComponent = Object.assign({}, consumptionComponentList[0]);
    consumptionComponent.searchByConsumptionComponents = [];

    keyValueList.forEach((keyValue: string) => {
      if (consumptionComponentList[0].searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id) {
        consumptionComponent.searchByConsumptionComponents[keyValue] = consumptionComponentList[0].searchByConsumptionComponents[keyValue];
      }
    });

    return consumptionComponent;
  }

  /**
   * Returns the formatted form of the consumption component.
   *
   * @param consumptionComponent The consumption component
   * @return String containing the formatted consumption
   */
  getFormattedConsumptionList(consumptionComponent: TmaCmsConsumptionComponent): string[] {
    if (!consumptionComponent ||
      !consumptionComponent.searchByConsumptionComponents) {
      return [];
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return [];
    }

    const consumptionDisplayList: string[] = [];

    keyValueList.forEach((keyValue: string) => {
      const consumptionDetails = consumptionComponent.searchByConsumptionComponents[keyValue];

      consumptionDisplayList.push(
        this.getConsumption(consumptionDetails.productSpecification.id, consumptionDetails.usageUnit.id)
        + ' ' + consumptionDetails.usageUnit.name
        + '/' + consumptionDetails.billingFrequency
      );
    });
    this.store.dispatch(new TmaChecklistActionAction.ChecklistActionDetails( [{ type: TmaChecklistActionType.ESTIMATED_CONSUMPTION, value: consumptionDisplayList[0] }]));
    return consumptionDisplayList;
  }

  /**
   * Retrieved the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @param consumptionComponent The consumption component
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent): string {
    const usageUnit: TmaUsageUnit = this.getUsageUnit(product, consumptionComponent);
    this.consumption = this.getConsumption(product.productSpecification.id, usageUnit.id);

    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, this.consumption, this.getTermValue(product, consumptionComponent)));
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @param consumptionComponent The consumption component
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string, consumptionComponent: TmaCmsConsumptionComponent): string {
    const usageUnit: TmaUsageUnit = this.getUsageUnit(product, consumptionComponent);
    this.consumption = this.getConsumption(product.productSpecification.id, usageUnit.id);

    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.consumption, this.getTermValue(product, consumptionComponent)));
  }

  protected getConsumption(productSpecification: string, usageUnit: string): number {
    let consumption: string = null;
    this.activatedRoute.queryParams.subscribe(params => {
      consumption = params['consumption'];
    });

    if (consumption) {
      return Number(consumption);
    }

    const consumptionFromLocalStorage = localStorage.getItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit);

    if (consumptionFromLocalStorage) {
      return Number(consumptionFromLocalStorage);
    }

    const defaultConsumptionValue = this.consumptionConfig.consumption.defaultValues.find((consumptionValue: TmaConsumptionValue) => consumptionValue.productSpecification === productSpecification && consumptionValue.usageUnit === usageUnit);
    if (!defaultConsumptionValue) {
      const consumptionValue = this.consumptionConfig.consumption.default;
      localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, consumptionValue.value.toString());
      return Number(consumptionValue);
    }

    localStorage.setItem('consumption' + SEPARATOR + productSpecification + SEPARATOR + usageUnit, defaultConsumptionValue.consumptionOption.value.toString());
    return Number(defaultConsumptionValue.consumptionOption.value.toString());
  }

  protected getTermValue(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): number {

    const term = this.getTerm(product, consumptionComponent);
    if (!term) {
      return 1;
    }

    const billingFrequency: TmaBillingFrequencyMap = this.billingFrequencyConfig.billingFrequency
      .find((frequency: TmaBillingFrequencyMap) => frequency.key === term);

    if (billingFrequency) {
      return billingFrequency.value;
    }

    return 1;
  }

  protected getTerm(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!product || !consumptionComponent) {
      return '';
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1) {
      return '';
    }

    const keyForConsumptionComponent = keyValueList.find((keyValue: string) =>
      consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id
    );

    if (consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent] &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].billingFrequency
    ) {
      return consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].billingFrequency;
    }

    return '';
  }

  protected getUsageUnit(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): TmaUsageUnit {
    if (!product || !consumptionComponent) {
      return null;
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1 || !product.productSpecification) {
      return null;
    }

    const keyForConsumptionComponent = keyValueList.find((keyValue: string) => {
        if (consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification) {
          return consumptionComponent.searchByConsumptionComponents[keyValue].productSpecification.id === product.productSpecification.id;
        }
        return null;
      }
    );

    if (keyForConsumptionComponent &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent] &&
      consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].usageUnit
    ) {
      return consumptionComponent.searchByConsumptionComponents[keyForConsumptionComponent].usageUnit;
    }

    return null;
  }

  get productService(): TmaProductService {
    return this.tmaProductService;
  }
}
