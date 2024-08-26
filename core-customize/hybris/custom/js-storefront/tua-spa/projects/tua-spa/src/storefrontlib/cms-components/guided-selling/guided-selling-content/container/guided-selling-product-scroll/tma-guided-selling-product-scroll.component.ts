// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ProductListComponentService } from '@spartacus/storefront';
import { TmfProduct } from '../../../../../../core';
import { TmaProductScrollComponent } from '../../../../product/product-list';

@Component({
  selector: 'cx-guided-selling-product-scroll',
  templateUrl: './tma-guided-selling-product-scroll.component.html',
  styleUrls: ['./tma-guided-selling-product-scroll.component.scss']
})
export class TmaGuidedSellingProductScrollComponent extends TmaProductScrollComponent {

  @Input()
  tmfProducts: TmfProduct[];

  constructor(
    protected tmaProductListComponentService: ProductListComponentService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    super(tmaProductListComponentService, changeDetectorRef);
  }
}
