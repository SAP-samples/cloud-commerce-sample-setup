// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TmaBaAgreementType } from '../../../../../core';
import { TmaCellComponent } from '../tma-cell.component';

@Component({
    selector: 'selfcare-status-cell',
    templateUrl: './tma-status-cell.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaAgreementStatusCellComponent extends TmaCellComponent{
    get label() {
        if (this.isActive === undefined){
            return '';
        }

        return this.isActive
        ? this.labelString(this.model.status)
        : 'selfcare.billingAgreements.unapproved';
    }

    get isActive(): boolean {
        return this.model.status;
    }

    /**
     * Depending on the string that this function receives
     * it will return the correct status string for a Billing Agreement
     *
     * @param status BillingAgreement status
     * @returns A string, the status of the billing agreement
     */
    private labelString(status: string){
        let label: string;

        if (status.toLowerCase() === TmaBaAgreementType.APPROVED) {
          label = 'selfcare.billingAgreements.approved';
        }
        else {
          label = 'selfcare.billingAgreements.unapproved';
        }

        return label;
    }
}
