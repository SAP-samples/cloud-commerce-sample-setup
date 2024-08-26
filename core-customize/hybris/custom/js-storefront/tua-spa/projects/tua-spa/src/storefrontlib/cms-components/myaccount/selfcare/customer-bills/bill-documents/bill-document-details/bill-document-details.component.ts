// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { AttachmentRef, TmaCustomerBills } from '../../../../../../../core/model';
import { SelfcareService } from '../../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../../core/util/constants';
import { ActivatedRoute } from '@angular/router';

const { CUSTOMER_BILLS } = LOCAL_STORAGE.SELFCARE;

@Component({
    selector: 'cx-selfcare-bill-document-details',
    templateUrl: './bill-document-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'content-wrapper' }
})
export class BillDocumentDetailsComponent {
    readonly domainType = CUSTOMER_BILLS.BILL_DOCUMENT_DETAILS_DOMAIN_TYPE;
    readonly model$: Observable<TmaCustomerBills> = this.getCurrentKey().pipe(
        switchMap((code) => this.selfcareService.getCustomerBillDetails(code))
    );

    readonly getBillDocumentDetails$: Observable<AttachmentRef> =
        this.getBillDocumentId().pipe(
            switchMap((id) =>
                this.model$.pipe(
                    map((customerBills: TmaCustomerBills) =>
                        customerBills.billDocument.find(
                            (item: AttachmentRef) => item.id === id
                        )
                    )
                )
            )
        );

    constructor(
        protected selfcareService: SelfcareService,
        protected routingService: RoutingService,
        protected activatedRoute: ActivatedRoute
    ) {
    }

    /**
     * Represents Get Current key
     * @returns Current Key
     */
    private getCurrentKey(): Observable<string> {
        return this.routingService
            .getParams()
            .pipe(pluck(CUSTOMER_BILLS.KEY), distinctUntilChanged());
    }

    private getBillDocumentId(): Observable<string> {
        return this.activatedRoute.params.pipe(
            pluck(CUSTOMER_BILLS.BILL_DOCUMENT_ID),
            distinctUntilChanged()
        );
    }
}
