// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CmsComponentWithChildren, CmsService, CurrencyService } from '@spartacus/core';
import { CmsComponentData, CurrentProductService, ProductDetailsTabComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct, TmaProductOfferingPrice } from '../../../../../core/model';
import { TmaPriceService } from '../../../../../core/product/facade';

@Component({
  selector: 'cx-product-details-tab',
  templateUrl: './tma-product-details-tab.component.html',
  styleUrls: ['./tma-product-details-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductDetailsTabComponent extends ProductDetailsTabComponent implements OnInit {

  product$: Observable<TmaProduct>;
  currency$: Observable<string>;

  constructor(
    public priceService: TmaPriceService,
    protected currentProductService: CurrentProductService,
    protected currencyService: CurrencyService, cmsComponentData: CmsComponentData<CmsComponentWithChildren>, cmsService: CmsService
  ) {
    super(currentProductService, cmsComponentData, cmsService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.currency$ = this.currencyService.getActive();
  }

  isContractTermDisplayNeeded(priceList: TmaProductOfferingPrice[]): boolean {
    if (!priceList || priceList.length === 0) {
      return false;
    }

    return !!priceList.find((pop: TmaProductOfferingPrice) => pop.chargeType === 'recurring' || pop.chargeType === 'usage');
  }
}
