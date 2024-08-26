// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CardComponent } from '@spartacus/storefront';

@Component({
  selector: 'cx-card',
  templateUrl: './tma-checkout-card.component.html',
  styleUrls: ['./tma-checkout-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TmaCheckoutCardComponent extends CardComponent implements OnInit {

  ngOnInit() {
    super.ngOnInit();
  }
}
