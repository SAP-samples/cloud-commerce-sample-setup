// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ItemCounterComponent } from '@spartacus/storefront';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const COUNTER_CONTROL_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line */
  useExisting: forwardRef(() => TmaItemCounterComponent),
  multi: true
};

@Component({
  selector: 'cx-item-counter',
  templateUrl: './tma-item-counter.component.html',
  styleUrls: ['./tma-item-counter.component.scss'],
  providers: [COUNTER_CONTROL_ACCESSOR]
})
export class TmaItemCounterComponent extends ItemCounterComponent implements OnInit {

  @Input()
  quantity: number;

  @Input()
  entryNumber: number;

  @Input()
  quantityDisable: boolean;

  ngOnInit() {
    super.ngOnInit();
  }
}
