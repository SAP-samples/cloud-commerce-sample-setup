// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TmaProductOrder } from '../../../../core/model';

@Component({
  selector: 'cx-order-details-dropdown',
  templateUrl: './tma-order-details-dropdown.component.html',
  styleUrls: ['./tma-order-details-dropdown.component.scss']
})
export class TmaOrderDetailsDropdownComponent {

  @Input()
  productOrder: TmaProductOrder;

  @Output()
  closeDetails: EventEmitter<boolean> = new EventEmitter<boolean>();

  triggerCloseDetails(): void {
    this.closeDetails.emit(false);
  }
}
