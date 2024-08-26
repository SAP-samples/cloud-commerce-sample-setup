// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaBillStateEnum } from '../../../../../core';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
    selector: 'selfcare-status-cell',
    templateUrl: './tma-status-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaBillingStateCellComponent extends TmaCellComponent {
    get label() {
        if (this.isActive === undefined) {
            return '';
        }

        const state: TmaBillStateEnum = this.model.state;

        switch (state) {
            case TmaBillStateEnum.NEW:
                return 'selfcare.customerBills.new';
            case TmaBillStateEnum.ON_HOLD:
                return 'selfcare.customerBills.onHold';
            case TmaBillStateEnum.PARTIALY_PAID:
                return 'selfcare.customerBills.partiallyPaid';
            case TmaBillStateEnum.SENT:
                return 'selfcare.customerBills.sent';
            case TmaBillStateEnum.SETTLED:
                return 'selfcare.customerBills.settled';
            case TmaBillStateEnum.VALIDATED:
                return 'selfcare.customerBills.validated';
            default:
                return 'selfcare.customerBills.notSet';
        }
    }

    get isActive(): boolean {
        return this.model.state;
    }
}
