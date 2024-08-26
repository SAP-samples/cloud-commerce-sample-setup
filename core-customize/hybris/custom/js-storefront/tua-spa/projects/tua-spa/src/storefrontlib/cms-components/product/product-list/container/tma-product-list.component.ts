// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';
import { CmsService, ContentSlotComponentData, GlobalMessageService, Page } from '@spartacus/core';
import { LaunchDialogService, PageLayoutService, ProductListComponent, ViewConfig } from '@spartacus/storefront';
import {
  TmaCmsConsumptionComponent,
  TmaConsumptionChangeService,
  TmaProductListComponentService
} from '../../../../../core';
import { Observable, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'cx-product-list',
  templateUrl: './tma-product-list.component.html',
  styleUrls: ['./tma-product-list.component.scss']
})
export class TmaProductListComponent extends ProductListComponent implements OnInit, OnDestroy {

  @ViewChild('consumptionValue', { static: false })
  consumptionValue: ElementRef;

  url$: Observable<UrlSegment[]>;
  page$: Observable<Page>;

  protected queryParams: Params;
  protected consumption: number;
  protected subscriptions = new Subscription();

  protected queryParamsSubject: Subject<Params>;

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: TmaProductListComponentService,
    globalMessageService: GlobalMessageService,
    public scrollConfig: ViewConfig,
    protected consumptionChangeService: TmaConsumptionChangeService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected activatedRoute?: ActivatedRoute,
    protected cmsService?: CmsService,
  ) {
    super(pageLayoutService, productListComponentService, globalMessageService, scrollConfig);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.activatedRoute && this.cmsService) {
      this.url$ = this.activatedRoute.url;
      this.page$ = this.cmsService.getCurrentPage();

      this.activatedRoute.queryParams
      .subscribe((params: Params) => this.queryParams = params);
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.queryParamsSubject) {
      this.queryParamsSubject.unsubscribe();
    }
    this.subscriptions?.unsubscribe();
  }

  /**
   * Retrieves the consumption component on the page.
   * @param page The current page
   * @return The component as {@link TmaCmsConsumptionComponent}
   */
  getConsumptionComponent(page: Page): TmaCmsConsumptionComponent {
    const consumptionSlotKey: string = Object.keys(page.slots)
      .find((key: string) => page.slots[key].components && page.slots[key].components.find((component: ContentSlotComponentData) => component.typeCode === 'ConsumptionListComponent'));
    if (!consumptionSlotKey) {
      return null;
    }

    const consumptionSlot = page.slots[consumptionSlotKey];

    const consumptionComponentList: TmaCmsConsumptionComponent[] = [];
    consumptionSlot.components.forEach((component: ContentSlotComponentData) => {
      this.cmsService.getComponentData(component.uid)
        .pipe(first((consumptionComponent: TmaCmsConsumptionComponent) => consumptionComponent != null))
        .subscribe((consumptionComponent: TmaCmsConsumptionComponent) => consumptionComponentList.push(consumptionComponent));
    });

    if (!consumptionComponentList || consumptionComponentList.length === 0) {
      return null;
    }

    return consumptionComponentList[0];
  }
}
