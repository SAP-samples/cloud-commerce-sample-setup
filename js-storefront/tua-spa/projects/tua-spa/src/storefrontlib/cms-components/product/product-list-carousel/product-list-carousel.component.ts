// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  BaseSiteService,
  CurrencyService,
  isNotNullable,
  PageMeta,
  PageMetaService,
  ProductSearchPage,
  ProductSearchService,
  ProductService
} from '@spartacus/core';
import { Observable, of, Subscription } from 'rxjs';
import { filter, first, map, take } from 'rxjs/operators';
import { Product } from '@spartacus/core/src/model/product.model';
import { ICON_TYPE } from '@spartacus/storefront';
import {
  LOCAL_STORAGE,
  TmaCheckListActionDetails,
  TmaChecklistActionService,
  TmaChecklistActionType,
  TmaMoney,
  TmaPriceService,
  TmaProduct,
  TmaProductOfferingPrice
} from '../../../../core';

const { SWITCH_PROVIDER } = LOCAL_STORAGE.PAGES;

@Component({
  selector: 'cx-product-list-carousel',
  templateUrl: './product-list-carousel.component.html',
  styleUrls: ['./product-list-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TmaProductListCarouselComponent implements OnInit, OnDestroy {
  currency$ = this.currencyService.getActive();
  iconTypes = ICON_TYPE;
  consumption: number;
  division: string;
  averagePerMonth: TmaMoney;
  averagePerMonthWithOutDiscount: TmaMoney;
  displayCarousel$: Observable<boolean>;
  pageMeta$: Observable<PageMeta>;

  items$: Observable<any[]>;
  baseSiteId$: Observable<string> = this.baseSiteService.getActive().pipe(first((baseSiteId: string) => !!baseSiteId));

  protected subscription = new Subscription();

  constructor(protected productSearchService: ProductSearchService,
              protected cd: ChangeDetectorRef,
              protected currencyService: CurrencyService,
              protected productService: ProductService,
              protected tmaChecklistActionService: TmaChecklistActionService,
              protected priceService: TmaPriceService,
              protected pageMetaService: PageMetaService,
              protected baseSiteService: BaseSiteService
            ) {}

  ngOnInit() {
    this.pageMeta$ = this.pageMetaService.getMeta();
    this.displayCarousel$ = this.pageMeta$.pipe(filter(isNotNullable), map((meta) => meta.breadcrumbs.length === 2));
    this.subscription.add(this.displayCarousel$.pipe(filter((res) => res === true)).subscribe(() => {
      this.tmaChecklistActionService.getChecklistActionDetails().pipe(take(1),
        map(
          (results: TmaCheckListActionDetails[]) =>
            results.filter((result: TmaCheckListActionDetails) =>
              result.type === TmaChecklistActionType.ESTIMATED_CONSUMPTION)
        )).subscribe((res: TmaCheckListActionDetails[]) => {
        if (res.length) {
          this.consumption = JSON.parse(res[0].value.consumption).value;
          this.division = res[0].value.division;
          this.productSearchService.search(':relevance:allCategories:' + this.division.toLowerCase());
          this.items$ = this.productSearchService.getResults().pipe(filter((data: ProductSearchPage) => data?.products !== undefined),
            map((searchPage: ProductSearchPage) => this.createProductList(searchPage.products)));
        }
      });
    }))
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  calculateBonus(original: string, discounted: string, currency: string): string {
    const bonus = Number(original) - Number(discounted);
    return this.priceService.getFormattedPrice({ value: bonus.toFixed(2).toString(), currencyIso: currency });
  }

  getAverageCostPerYearWithOutDiscounts(currency: string): string {
    return this.priceService.getFormattedPrice({
      value: (Number(this.averagePerMonthWithOutDiscount.value) * 12).toFixed(2).toString(),
      currencyIso: currency
    });
  }

  getBaseChargePerMonth(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerMonth(product, currency, undefined, 12));
  }

  getUsageChargePerUnit(product: TmaProduct, currency: string): string {
    const eachRespectiveTierUsageChargePriceList = this.priceService.getUsageCharge(product);
    let usagePerUnit;
    if (!Object.keys(eachRespectiveTierUsageChargePriceList).length) {
     return undefined;
    }
    Object.keys(eachRespectiveTierUsageChargePriceList).forEach((key: string) => {
      usagePerUnit = eachRespectiveTierUsageChargePriceList[key].filter((childPrice: TmaProductOfferingPrice) => childPrice.tierStart === 1)[0];
    })
    return this.priceService.getFormattedPrice({ value: usagePerUnit.price?.value, currencyIso: currency }) + ' /' +usagePerUnit.usageUnit?.name;
  }

  /**
   * Retrieves the average cost per month.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per month
   */
  getAverageCostPerMonth(product: TmaProduct, currency: string): string {
    this.averagePerMonth = this.priceService.getAverageCostPerMonth(product, currency, this.consumption, 12);
    this.averagePerMonthWithOutDiscount = this.priceService.getAverageCostPerMonth(product, currency, this.consumption, 12, true);
    return this.priceService.getFormattedPrice(this.averagePerMonth);
  }

  /**
   * Retrieves the average cost per year.
   *
   * @param product The product for which the average cost is computed
   * @param currency The currency of the price
   * @return the average cost per year
   */
  getAverageCostPerYear(product: TmaProduct, currency: string): string {
    return this.priceService.getFormattedPrice(this.priceService.getAverageCostPerYear(product, currency, this.consumption, 12));
  }

  /**
   * Returns product list in an array of Observable for the carousel
   *
   * @param products Search result products list
   */
  createProductList(products: Product[]): Observable<any>[] {
    let array: any[] = [];
    products.forEach((item: Product) => {
      array.push(of(item))
    })
    return array;
  }

  getProductDetailsPath(pageMeta: PageMeta): string {
    return (pageMeta.breadcrumbs[1].link.toString()).replace('/', '') === SWITCH_PROVIDER 
      ? 'commodityProductDetailsSwitchProvider' 
      : 'commodityProductDetails';
  }

}
