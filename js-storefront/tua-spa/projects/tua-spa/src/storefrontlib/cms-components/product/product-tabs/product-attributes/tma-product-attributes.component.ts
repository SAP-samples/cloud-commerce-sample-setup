// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrentProductService, ProductAttributesComponent } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { TmaProduct, TmaProductSpecCharValueUse } from '../../../../../core/model';
import { ProductScope } from '@spartacus/core';

@Component({
  selector: 'cx-product-attributes',
  templateUrl: './tma-product-attributes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaProductAttributesComponent extends ProductAttributesComponent implements OnInit {
  product$: Observable<TmaProduct>;
  constructor(protected currentProductService: CurrentProductService) {
    super(currentProductService);
  }

  ngOnInit() {
    this.product$ = this.currentProductService.getProduct(
      ProductScope.ATTRIBUTES
    );
  }

  findStaticProdSpecCharValueUses( productSpecCharValueUses: TmaProductSpecCharValueUse[]): TmaProductSpecCharValueUse[] {
    const staticProductSpecCharValueUses: TmaProductSpecCharValueUse[] = [];
    productSpecCharValueUses.forEach(productSpecCharValueUse => {
      if (this.isStaticProdSpecCharValueUse(productSpecCharValueUse)) {
        staticProductSpecCharValueUses.push(productSpecCharValueUse);
      }
    });
    return staticProductSpecCharValueUses;
  }

  protected isStaticProdSpecCharValueUse(productSpecCharValueUse: TmaProductSpecCharValueUse): boolean {
    return (
      productSpecCharValueUse.maxCardinality === productSpecCharValueUse.minCardinality &&
      productSpecCharValueUse.maxCardinality ===
      productSpecCharValueUse.productSpecCharacteristicValue.length
    );
  }
}
