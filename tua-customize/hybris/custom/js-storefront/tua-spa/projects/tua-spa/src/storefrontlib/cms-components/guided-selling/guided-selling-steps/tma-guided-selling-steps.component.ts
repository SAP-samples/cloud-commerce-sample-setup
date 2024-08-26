// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductSearchService, WindowRef } from '@spartacus/core';
import { ProductListComponentService, SearchCriteria } from '@spartacus/storefront';
import { Subscription } from 'rxjs';
import { LOCAL_STORAGE } from '../../../../core/util/constants';
import { TmaGuidedSellingStep, TmaProcessTypeEnum } from '../../../../core/model';
import { TmaGuidedSellingStepsService } from '../../../../core/guided-selling/facade';
import { ActivatedRoute, Router } from '@angular/router';

const { QUERY, FREE_TEXT, PRODUCT_OFFERING_GROUP, PARENT_BPO, PROCESS_TYPE } = LOCAL_STORAGE.SEARCH;
const { DEFAULT_PROCESS_TYPE } = LOCAL_STORAGE.GUIDED_SELLING;

@Component({
  selector: 'cx-guided-selling-steps',
  templateUrl: './tma-guided-selling-steps.component.html',
  styleUrls: ['./tma-guided-selling-steps.component.scss']
})
export class TmaGuidedSellingStepsComponent implements OnInit, OnDestroy {

  @Input()
  bpoCode: string;

  @Input()
  compact: boolean;

  @Input()
  isSubscription: boolean;

  activeTabNum = 0;

  guidedSellingSteps: TmaGuidedSellingStep[];

  protected subscription = new Subscription();

  constructor(
    protected guidedSellingStepsService: TmaGuidedSellingStepsService,
    protected productSearchService: ProductSearchService,
    protected productListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected winRef: WindowRef

  ) {
  }

  ngOnInit(): void {
    this.activeTabNum =
      this.winRef?.nativeWindow?.history?.state?.activeTab ?? this.activeTabNum;
    this.guidedSellingSteps = this.guidedSellingStepsService.getGuidedSellingSteps(this.bpoCode);

    if (this.guidedSellingSteps && this.guidedSellingSteps.length !== 0) {
      const activeStep: TmaGuidedSellingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.active === true);

      if (activeStep) {
        this.displayProducts(activeStep.id, activeStep.inProductGroup);
      }
    }

    this.subscription.add(
      this.guidedSellingStepsService.guidedSellingSteps$
        .subscribe((value: TmaGuidedSellingStep[]) => {
          this.guidedSellingSteps = value;
          const activeStep: TmaGuidedSellingStep = this.guidedSellingSteps.find((step: TmaGuidedSellingStep) => step.active === true);

          if (activeStep) {
            this.displayProducts(activeStep.id, activeStep.inProductGroup);
          }
          this.changeDetectorRef.detectChanges();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

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

  /**
   * Changes the active step.
   *
   * @param id - The identifier of the step which will become active
   * @param inProductGroup - Flag indicating if step is part of a product offering group or not
   */
  changeActiveStep(id: string, inProductGroup: boolean): void {
    this.guidedSellingSteps.forEach((step: TmaGuidedSellingStep) =>
      step.active = step.id === id
    );

    this.displayProducts(id, inProductGroup);
  }

  protected displayProducts(id: string, inProductGroup: boolean): void {
    let query = QUERY + FREE_TEXT + PRODUCT_OFFERING_GROUP + id;
    let bpoQuery = QUERY + FREE_TEXT + PARENT_BPO + id;

    let process = DEFAULT_PROCESS_TYPE;
    let processFilterQuery = ':'+ PROCESS_TYPE + process;

    if(this.isSubscription){
      process = TmaProcessTypeEnum.RETENTION;
      processFilterQuery = ':'+ PROCESS_TYPE + process;
    }

    query = query + processFilterQuery;
    bpoQuery = bpoQuery + processFilterQuery;

    if (inProductGroup) {
      this.tmaSetQuery(query);
      this.productSearchService.search(query);
    }
    else {
      this.tmaSetQuery(query);
      this.productSearchService.search(bpoQuery, { pageSize: 10 });
    }
  }

  tmaSetQuery(query: string): void {
    this.tmaRoute({ query, currentPage: undefined });
  }

  tmaRoute(queryParams: SearchCriteria): void {
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }
}
