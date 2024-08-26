// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyService, ProductService } from '@spartacus/core';
import { CurrentProductService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct } from '../../../../../core/model';

@Component({
    selector: 'cx-product-included-services-tab',
    templateUrl: './tma-product-included-services-tab.component.html',
    styleUrls: ['./tma-product-included-services-tab.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductIncludedServicesTabComponent implements OnInit {

    product$: Observable<TmaProduct | null> = this.currentProductService.getProduct();
    currency$: Observable<string>;

    constructor(
        protected currentProductService: CurrentProductService,
        protected currencyService: CurrencyService,
        protected productService: ProductService

    ) { }

    ngOnInit() {
        this.currency$ = this.currencyService.getActive();
    }

    getChildProductDetails(productCode: string): Observable<TmaProduct> {
        return this.productService.get(productCode);
    }
}
