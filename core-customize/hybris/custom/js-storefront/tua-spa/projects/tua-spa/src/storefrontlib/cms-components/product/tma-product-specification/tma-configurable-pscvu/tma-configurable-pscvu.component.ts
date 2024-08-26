// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, Input } from '@angular/core';
import { TmaProduct } from '../../../../../core/model';

@Component({
  selector: 'cx-tma-configurable-pscvu',
  templateUrl: './tma-configurable-pscvu.component.html',
  styleUrls: ['./tma-configurable-pscvu.component.scss']
})
export class TmaConfigurablePscvuComponent {

  @Input()
  product: TmaProduct;

}
