// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SpiProductStatusType } from '../../../../../core/model/spi-product.model';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
  selector: 'selfcare-status-cell',
  templateUrl: './tma-status-cell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaStatusCellComponent extends TmaCellComponent {
  get label() {
    if (this.isActive === undefined) {
      return '';
    }

    return this.isActive ?
      this.labelString(this.status) :
      'selfcare.subscriptions.disabled';
  }

  get status(): string {
    return this.model.status;
  }

  private labelString(status: string): string {
    let label: string;

    switch (status.toLowerCase()) {
      case SpiProductStatusType.ACTIVE:
        label = 'selfcare.subscriptions.statusDetails.active';
        break;
      case SpiProductStatusType.PENDINGTERMINATE:
        label = 'selfcare.subscriptions.statusDetails.pendingTerminate';
        break;
      case SpiProductStatusType.TERMINATED:
        label = 'selfcare.subscriptions.statusDetails.terminated';
        break;
      default:
        break;
    }

    return label;
  }

  get isActive(): boolean {
    return this.model.status;
  }
}
