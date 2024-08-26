import { ChangeDetectionStrategy, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  TmaCheckListActionDetails, TmaChecklistActionService,
  TmaChecklistActionType,
  TmaMoney,
  TmaPriceService,
  TmaProduct,
  TmaProductOfferingPrice
} from '../../../../core';
import { combineLatest, distinctUntilChanged, map, Observable, switchMap, tap } from 'rxjs';
import { ComponentWrapperDirective, CurrentProductService, ICON_TYPE } from '@spartacus/storefront';
import {
  CmsService,
  CMSTabParagraphContainer,
  CurrencyService,
  WindowRef,
  CmsProductCarouselComponent as model,
  ProductScope,
  ProductService,
} from '@spartacus/core';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'cx-commodity-product-details',
  templateUrl: './commodity-product-details.component.html',
  styleUrls: ['./commodity-product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TmaCommodityProductDetailsComponent implements OnInit {
  protected readonly PRODUCT_SCOPE = [ProductScope.LIST, ProductScope.STOCK];

  protected readonly PRODUCT_SCOPE_ITEM = [ProductScope.LIST_ITEM];

  currency$ = this.currencyService.getActive();
  activeTabNum = 0;
  ariaLabel: string;
  currentProduct$: Observable<TmaProduct>;
  iconTypes = ICON_TYPE;
  consumption: number;
  averagePerMonth: TmaMoney;
  averagePerMonthWithOutDiscount: TmaMoney;

  @ViewChildren(ComponentWrapperDirective)
  children!: QueryList<ComponentWrapperDirective>;

  tabTitleParams: (Observable<any> | null)[] = [];

  private componentData$: Observable<model> = this.cmsService.getComponentData('UtilitiesProductCarouselComponent').pipe(
    filter((data) => Boolean(data))
  );

  title$: Observable<string | undefined> = this.componentData$.pipe(
    map((data) => data.title)
  );

  constructor(
    protected cmsService: CmsService,
    protected winRef: WindowRef,
    protected currentProductService: CurrentProductService,
    protected currencyService: CurrencyService,
    protected priceService: TmaPriceService,
    protected tmaChecklistActionService: TmaChecklistActionService,
    protected productService: ProductService
  ) {}

  items$: Observable<Observable<TmaProduct | undefined>[]> =
    this.componentData$.pipe(
      map((data) => {
        const componentMappingExist = !!data.composition?.inner?.length;
        const codes = data.productCodes?.trim().split(' ') ?? [];
        return { componentMappingExist, codes };
      }),
      map(({ componentMappingExist, codes }) => {
        const productScope = componentMappingExist
          ? [...this.PRODUCT_SCOPE]
          : [...this.PRODUCT_SCOPE_ITEM];
        return codes.map((code) => this.productService.get(code, productScope));
      })
    );

  components$: Observable<any[]> = this.cmsService.getComponentData('TabPanelContainer').pipe( 
    tap((data: CMSTabParagraphContainer) => {
      this.ariaLabel = `${data?.uid}.tabPanelContainerRegion`;
    }),
    switchMap((data) =>
      combineLatest(
        (data?.components ?? '').split(' ').map((component) =>
          this.cmsService.getComponentData<any>(component).pipe(
            distinctUntilChanged(),
            map((tab) => {
              if (!tab) {
                return undefined;
              }

              if (!tab.flexType) {
                tab = {
                  ...tab,
                  flexType: tab.typeCode,
                };
              }

              return {
                ...tab,
                title: `${data.uid}.tabs.${tab.uid}`,
              };
            })
          )
        )
      )
    )
  );

  select(tabNum: number, event?: MouseEvent): void {
    this.activeTabNum = this.activeTabNum === tabNum ? -1 : tabNum;
    if (event && event?.target) {
      const target = event.target as HTMLElement;
      const parentNode = target.parentNode as HTMLElement;
      this.winRef?.nativeWindow?.scrollTo({
        left: 0,
        top: parentNode.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  ngOnInit(): void {
    this.activeTabNum =
      this.winRef?.nativeWindow?.history?.state?.activeTab ?? this.activeTabNum;
      this.currentProduct$ = this.currentProductService.getProduct();

    this.tmaChecklistActionService.getChecklistActionDetails().pipe(take(1),
      map(
        (results: TmaCheckListActionDetails[]) =>
          results.filter((result: TmaCheckListActionDetails) =>
            result.type === TmaChecklistActionType.ESTIMATED_CONSUMPTION)
      )).subscribe((res: TmaCheckListActionDetails[]) => {
      if (res.length) {
        this.consumption = JSON.parse(res[0].value.consumption).value;
      }
    });
  }

  ngAfterViewInit(): void {
    // If the sub cms components data exist, the components created before ngAfterViewInit are called.
    // In this case, the title parameters are directly pulled from them.
    if (this.children.length > 0) {
      this.getTitleParams(this.children);
    }
  }

  tabCompLoaded(componentRef: any): void {
    this.tabTitleParams.push(componentRef.instance.tabTitleParam$);
  }

  protected getTitleParams(children: QueryList<ComponentWrapperDirective>) {
    children.forEach((comp) => {
      this.tabTitleParams.push(comp['cmpRef']?.instance.tabTitleParam$ ?? null);
    });
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

  getFormattedSubscriptionTerms(product: TmaProduct): string[]
  {
    const highestPriorityPrice = this.priceService.getHighestPriorityPriceForSPO(product);
    let subscriptionTerms: string[] = [];
    subscriptionTerms.push(...highestPriorityPrice?.productOfferingTerm.map(value => value.name));
    return subscriptionTerms
  }
}
