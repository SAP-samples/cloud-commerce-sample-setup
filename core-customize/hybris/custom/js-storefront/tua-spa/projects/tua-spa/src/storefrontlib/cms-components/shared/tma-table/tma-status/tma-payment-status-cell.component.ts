// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
  selector: 'selfcare-status-cell',
  templateUrl: './tma-status-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaPaymentStatusCellComponent extends TmaCellComponent {
  get label() {
    if (this.isActive === undefined) {
      return '';
    }
    return this.isActive
      ? 'selfcare.billingAccounts.paid'
      : 'selfcare.billingAccounts.due';
  }

  get isActive(): boolean {
    return this.model.paymentStatus;
  }
}
