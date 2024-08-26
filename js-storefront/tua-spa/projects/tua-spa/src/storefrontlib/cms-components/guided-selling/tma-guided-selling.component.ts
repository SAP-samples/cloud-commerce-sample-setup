// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BREAKPOINT, BreakpointService } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  SubscriptionDetailDataService,
  TmaProcessTypeEnum,
  TmaProduct,
  TmfProduct,
  TmfProductMap,
  TmfProductService
} from '../../../core';
import { TmaGuidedSellingCurrentSelectionsService, TmaGuidedSellingStepsService } from '../../../core/guided-selling/facade';

@Component({
  selector: 'cx-guided-selling',
  templateUrl: './tma-guided-selling.component.html'
})
export class TmaGuidedSellingComponent implements OnInit, OnDestroy {

  bpoCode: string;
  compact: boolean;
  tmfProducts: TmfProduct[];
  subscriptionDetail: TmfProductMap;
  isSubscription = false;
  currentSelections: TmaProduct[];

  protected subscription = new Subscription();

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected breakpointService: BreakpointService,
    protected guidedSellingCurrentSelectionsService: TmaGuidedSellingCurrentSelectionsService,
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected subscriptionDetailDataService?: SubscriptionDetailDataService,
    protected tmfProductService?: TmfProductService,
  ) {
    this.currentSelections = this.guidedSellingCurrentSelectionsService.getCurrentSelections();
  }

  ngOnInit(): void {
    this.bpoCode = this.activatedRoute.snapshot.url[1].toString();
    this.compact = window.innerWidth < this.breakpointService.getSize(BREAKPOINT.md);
    const isRetentionProcessType: boolean = this.activatedRoute.snapshot.url.some((value: UrlSegment) => value.toString() === TmaProcessTypeEnum.RETENTION);
    if (isRetentionProcessType) {
      this.subscription.add(
        this.subscriptionDetailDataService.getSubscriptionDetail
          .pipe(
            first((subscriptionDetail: TmfProductMap) => Object.keys(subscriptionDetail).length > 0)
          )
          .subscribe((subscriptionDetail: TmfProductMap) => {
            this.subscriptionDetail = subscriptionDetail;
            this.tmfProducts = this.subscriptionDetail.tmfProducts;
            this.isSubscription = true;
          })
      );
    }
    if (this.currentSelections.length === 0) {
      this.activatedRoute.snapshot.url.splice(2, 1);
      this.tmfProducts = [];
      this.isSubscription = false;
    }
  }

  ngOnDestroy(): void {
    if (this.guidedSellingCurrentSelectionsService.shouldRemoveCurrentSelections) {
      this.guidedSellingCurrentSelectionsService.clearCurrentSelections();
      this.guidedSellingStepsService.setFirstStepAsActiveStep();
    }
    this.subscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.compact = window.innerWidth < this.breakpointService.getSize(BREAKPOINT.md);
  }
}
