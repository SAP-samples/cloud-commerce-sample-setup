// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseSiteService, OccConfig, User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { CmsComponentData, MediaService } from '@spartacus/storefront';
import { Observable, of, Subscription } from 'rxjs';
import {
  ProductOfferingService,
  RecommendationService,
  SubscriptionTermService,
  TmaPriceService,
  TmaProcessTypeEnum,
  TmaProduct,
  TmfProduct,
  TmfProductMap,
  TmfProductService
} from '../../../../../core';
import {
  TmaCmsBannerRenewalComponent,
  TmaProductOfferingPrice,
  TmaSubscriptionTerm,
  TmfProductOfferingType,
  TmfProductStatus
} from '../../../../../core/model';
import { distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'cx-renew-subscription-banner',
  templateUrl: './renew-subscription-banner.component.html',
  styleUrls: ['./renew-subscription-banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RenewSubscriptionBannerComponent
  implements OnInit, OnDestroy {
  baseUrl: string;
  baseSiteId: string;
  user: User;
  subscriptionId: string;
  subscriptionDetail$: Observable<TmfProductMap>;
  renewalEligibility$: Observable<boolean>;
  selectedTermId$: Observable<string> = this.subscriptionTermService.getSelectedSubscriptionTermId().pipe(distinctUntilChanged());
  tmfProductOfferings: TmfProduct[] = [];
  eligibleTerms: TmaSubscriptionTerm [];
  validSubscribedProducts: TmfProduct[] = [];
  highestPriorityProductOfferingPrice: TmaProductOfferingPrice;
  list: TmaProductOfferingPrice[] = [];
  protected subscription = new Subscription();

  constructor(
    public component: CmsComponentData<TmaCmsBannerRenewalComponent>,
    public mediaService: MediaService,
    public productOfferingService: ProductOfferingService,
    public priceService: TmaPriceService,
    public subscriptionTermService: SubscriptionTermService,
    protected config: OccConfig,
    protected recommendationService: RecommendationService,
    protected tmfProductService: TmfProductService,
    protected baseSiteService: BaseSiteService,
    protected userAccountFacade: UserAccountFacade,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.baseSiteService
        .getActive()
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );
    this.subscription.add(
      this.userAccountFacade
        .get()
        .subscribe((customer: User) => (this.user = customer))
    );
    this.subscriptionId = this.activatedRoute.snapshot.url[3].toString();
    this.subscriptionDetail$ = this.tmfProductService.getTmfProductMap(this.subscriptionId).pipe(distinctUntilChanged());
    this.subscription.add(
      this.subscriptionDetail$.pipe(
        filter((subscription: TmfProductMap) => subscription !== undefined)
      ).subscribe((subscription: TmfProductMap) => {
      this.renewalEligibility$ = this.isSubscriptionEligibleForRenewal(subscription).pipe(distinctUntilChanged());
        this.tmfProductOfferings = [];
      subscription.tmfProducts?.forEach((tmfProduct: TmfProduct) => {
        this.subscription.add(
          this.productOfferingService.getProductOffering(this.baseSiteId, tmfProduct.productOffering?.id, TmaProcessTypeEnum.RENEWAL)
          .pipe(filter((product) => product !== undefined))
          .subscribe((product: TmaProduct) => {
            this.tmfProductOfferings.push(product);
            this.eligibleTerms = this.priceService.getEligibleSubscriptionTerms(product.productOfferingPrice);
            if (this.eligibleTerms.length && this.tmfProductOfferings.length) {
              this.tmfProductOfferings.forEach((product: TmfProduct) => {
                this.setSubscriptionTermAndPrice(this.eligibleTerms, product.productOfferingPrice, this.eligibleTerms[0].id);
              })
            }
            this.changeDetectorRef.detectChanges();
          })
        );
      });
    })
    )
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.tmfProductService.clearTmfProductDetails();
    this.productOfferingService.clearProductOfferingState();
    this.subscriptionTermService.clearSelectedSubscriptionTerm();
  }

  /**
   * Checks if subscription is eligible for renewal.
   *
   * @param subscriptionDetails Details of subscription base
   *
   * @return true if subscription is eligible for renewal as {@link boolean} as an {@link Observable}
   */
  isSubscriptionEligibleForRenewal(
    subscriptionDetails: TmfProductMap
  ): Observable<boolean> {
    const subscribedProducts: TmfProduct[] = subscriptionDetails?.tmfProducts;
    this.validSubscribedProducts = subscribedProducts?.filter(
      (subscribedProduct: TmfProduct) =>
        subscribedProduct.productOffering['@referredType'] !==
          TmfProductOfferingType.OPERATIONAL_PRODUCT_OFFERING &&
        subscribedProduct.status === TmfProductStatus.active
    );
    if (this.validSubscribedProducts?.length > 0) {
      return this.recommendationService.checkRecommendationsFor(
        this.baseSiteId,
        this.user.uid,
        TmaProcessTypeEnum.RENEWAL,
        this.validSubscribedProducts[0].productOffering.id,
        subscriptionDetails.tmfProduct.id
      );
    }
    return of(undefined);
  }

  /**
   * This method sets the subscription term in state.Based on the provided selected term,
   * also sets the highest priority price.
   *
   * @param eligibleTerms - Array of eligible subscription term
   * @param prices - Array containing all prices for subscribed product
   * @param priceContext - Array of price context for the product offering.
   * @param selectedTermId - Selected subscription term id
   */
  setSubscriptionTermAndPrice(
    eligibleTerms: TmaSubscriptionTerm[],
    prices: TmaProductOfferingPrice[],
    selectedTermId?: string
  ): void {
    const selectedTerm = eligibleTerms.find(
      (term: TmaSubscriptionTerm) => term.id === selectedTermId
    );
    this.subscriptionTermService.setSubscriptionTerm(selectedTerm);
    this.highestPriorityProductOfferingPrice = prices.find(
      (price: TmaProductOfferingPrice) =>
        price?.id ===
        this.priceService.getHighestPriorityPriceContext(
          prices,
          selectedTerm?.id
        )?.id
    );
  }
}
