// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductViewComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-product-view',
  templateUrl: './tma-product-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaProductViewComponent extends ProductViewComponent {
}
