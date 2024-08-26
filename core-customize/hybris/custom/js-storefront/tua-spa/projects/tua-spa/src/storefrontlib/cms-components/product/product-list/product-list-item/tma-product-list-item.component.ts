// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BaseSiteService, CurrencyService, ProductService } from '@spartacus/core';
import { ProductListItemComponent, ProductListItemContext, ProductListItemContextSource } from '@spartacus/storefront';
import { Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  SEPARATOR,
  TmaBillingFrequencyConfig,
  TmaBillingFrequencyMap,
  TmaChecklistAction,
  TmaChecklistActionService,
  TmaCmsConsumptionComponent,
  TmaConsumptionConfig,
  TmaConsumptionValue,
  TmaProduct,
  TmaUsageUnit
} from '../../../../../core';
import { TmaConsumptionChangeService, TmaPriceService, TmaProductService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-list-item',
  templateUrl: './tma-product-list-item.component.html',
  styleUrls: ['./tma-product-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductListItemContextSource,
    {
      provide: ProductListItemContext,
      useExisting: ProductListItemContextSource,
    },
  ],
})
export class TmaProductListItemComponent extends ProductListItemComponent implements OnInit, OnDestroy, OnChanges  {

  @Input()
  consumptionComponent: TmaCmsConsumptionComponent;

  @ViewChild('averageCostPerMonth', { static: false })
  averageCostPerMonth: ElementRef;

  @ViewChild('averageCostPerYear', { static: false })
  averageCostPerYear: ElementRef;

  currency$: Observable<string>;
  detailedProduct$: Observable<TmaProduct>;
  productSpecificationForViewDetails: boolean;
  productSpecificationForAverageCost: boolean;
  consumption: number;
  currency: string;
  detailedProduct: TmaProduct;
  protected subscription = new Subscription();
  protected baseSiteId: string;

  protected consumptionChangeServiceSubject: Subscription;

  constructor(
    public productListItemContextSource: ProductListItemContextSource,
    public priceService?: TmaPriceService,
    protected currencyService?: CurrencyService,
    protected productService?: ProductService,
    protected consumptionConfig?: TmaConsumptionConfig,
    protected productSpecificationProductService?: TmaProductService,
    protected consumptionChangeService?: TmaConsumptionChangeService,
    protected billingFrequencyConfig?: TmaBillingFrequencyConfig,
    protected tmaChecklistActionService?: TmaChecklistActionService,
    protected baseSiteService?: BaseSiteService,
    protected cdr?: ChangeDetectorRef
  ) {
    super(productListItemContextSource);
  }

  ngOnInit() {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(
          first((baseSiteId: string) => !!baseSiteId)
        )
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );

    const usageUnit: TmaUsageUnit = this.getUsageUnit(this.product, this.consumptionComponent);

    if (this.product && this.product.productSpecification) {
      this.productSpecificationForViewDetails = this.productSpecificationProductService.isProductSpecificationForViewDetails(this.product.productSpecification.id);
      this.productSpecificationForAverageCost = this.productSpecificationProductService.isProductSpecificationForAverageCost(this.product.productSpecification.id);

      if ((this.productSpecificationForAverageCost || this.productSpecificationForViewDetails) && this.consumptionComponent) {
        this.consumption = this.getConsumption(this.product.productSpecification.id, usageUnit.id);

        this.detailedProduct$ = this.productService.get(this.product.code);
        this.detailedProduct$
          .pipe(first((prod: TmaProduct) => prod != null))
          .subscribe((prod: TmaProduct) => this.detailedProduct = prod);
      }
    }

    this.currency$ = this.currencyService.getActive();
    this.currency$
      .pipe(first((curr: string) => curr !== null && curr !== ''))
      .subscribe((curr: string) => this.currency = curr);

    this.consumptionChangeServiceSubject = this.consumptionChangeService.consumption$.subscribe((consumptionInformation) => {
      if (consumptionInformation.productSpecification === this.product.productSpecification.id) {
        this.consumption = this.getConsumption(this.product.productSpecification.id, usageUnit.id);
        this.averageCostPerMonth.nativeElement.innerText = this.getAverageCostPerMonth(this.detailedProduct, this.currency);
        this.averageCostPerYear.nativeElement.innerText = this.getAverageCostPerYear(this.detailedProduct, this.currency);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnChanges(changes?: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.consumptionChangeServiceSubject) {
      this.consumptionChangeServiceSubject.unsubscribe();
    }
  }

  getChecklistActions(productCode: string): Observable<TmaChecklistAction[]> {
    return this.tmaChecklistActionService.getChecklistActionForProductCode(
      this.baseSiteId,
      productCode
    );
  }

  /**
   * Retrieves the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, this.consumption, this.getTermValue()));
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.consumption, this.getTermValue()));
  }

  /**
   * Retrieves the term value of a product specification.
   *
   * @return the term value
   */
  getTermValue(): number {
    const term: string = this.getTerm(this.product, this.consumptionComponent);
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

  protected getConsumption(productSpecification: string, usageUnit: string): number {
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

  protected getTerm(product: TmaProduct, consumptionComponent: TmaCmsConsumptionComponent): string {
    if (!product || !consumptionComponent) {
      return '';
    }

    const keyValueList: string[] = Object.keys(consumptionComponent.searchByConsumptionComponents);

    if (!keyValueList || keyValueList.length < 1 || !product.productSpecification) {
      return '';
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
}
