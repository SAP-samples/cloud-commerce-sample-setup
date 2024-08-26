// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LaunchDialogService, PageLayoutService, ViewConfig } from '@spartacus/storefront';
import {
    LOCAL_STORAGE,
    TmaProductOfferingPrice,
    TmfProduct,
    TmaProcessType,
    TmaProduct,
    TmaConfigurablePscInputsDataHandlingService,
    TmaConsumptionChangeService,
    TmaProductListComponentService
} from '../../../../../core';
import { TmaProductListComponent } from '../../../product/product-list';
import { GlobalMessageService, ProductSearchPage } from '@spartacus/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

const { DEFAULT_PROCESS_TYPE } = LOCAL_STORAGE.GUIDED_SELLING;

@Component({
  selector: 'cx-guided-selling-product-list',
  templateUrl: './tma-guided-selling-product-list.component.html',
  styleUrls: ['./tma-guided-selling-product-list.component.scss']
})
export class TmaGuidedSellingProductListComponent
  extends TmaProductListComponent
  implements OnInit
{
  @Input()
  tmfProducts: TmfProduct[];

  constructor(
    pageLayoutService: PageLayoutService,
    productListComponentService: TmaProductListComponentService,
    globalMessageService: GlobalMessageService,
    public scrollConfig: ViewConfig,
    protected consumptionChangeService: TmaConsumptionChangeService,
    protected launchDialogService: LaunchDialogService,
    protected vcr: ViewContainerRef,
    protected configurablePscvusService: TmaConfigurablePscInputsDataHandlingService,
    protected activatedRoute: ActivatedRoute
  ) {
    super(
      pageLayoutService,
      productListComponentService,
      globalMessageService,
      scrollConfig,
      consumptionChangeService,
      launchDialogService,
      vcr
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.model$ = this.model$.pipe(
        switchMap((model: ProductSearchPage) => {
            const filteredProducts = model.products.filter((product: TmaProduct) => {
                return product.productOfferingPrice.some((productOfferingPrice: TmaProductOfferingPrice) => {
                    return productOfferingPrice.processType.some((processType: TmaProcessType) =>
                        processType.id === DEFAULT_PROCESS_TYPE);
                });
            });

            const productSearchPageResult: ProductSearchPage = {
                products: filteredProducts,
                currentQuery: model.currentQuery,
                facets: model.facets,
                freeTextSearch: model.freeTextSearch,
                sorts: model.sorts,
                pagination: model.pagination
            };

            return of(productSearchPageResult);
        })
    );
    this.configurablePscvusService.cleanData();
  }
}
