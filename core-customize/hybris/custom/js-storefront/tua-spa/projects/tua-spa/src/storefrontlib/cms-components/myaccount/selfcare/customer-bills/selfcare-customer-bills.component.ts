// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { TableLayout, TableStructure } from '@spartacus/storefront';
import { TmfSelfcareTreeService } from '../../../../../core/tmf/adapters/selfcare/facade/tmf-selfcare-tree-service';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { TmaCustomerBills } from '../../../../../core/model';
import { SelfcareService } from '../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { TmaActiveLinkCellComponent } from '../../../shared/tma-table/tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from '../../../shared/tma-table/tma-cell.component';
import { TmaBillingStateCellComponent } from '../../../shared/tma-table/tma-status/tma-billing-state-cell.component';

const { CUSTOMER_BILLS } = LOCAL_STORAGE.SELFCARE;

@Component({
    selector: 'cx-selfcare-table',
    templateUrl: 'selfcare-customer-bills.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelfcareCustomerBillsComponent implements OnInit {
    readonly key = CUSTOMER_BILLS.KEY;
    readonly domainType = CUSTOMER_BILLS.DOMAIN_TYPE;
    public listData$: Observable<TmaCustomerBills[]>;
    public structure$: TableStructure;

    constructor(
        protected selfcareService: SelfcareService,
        protected selfcareTreeService: TmfSelfcareTreeService,
        protected routing: RoutingService
    ) {
    }

    ngOnInit() {
        this.structure$ = this.getTableStructure();
        this.listData$ = this.getSelfcareCustomerBills();
    }

    /**
     * Get selfcare bills
     * @returns TmaCustomerBills
     */
    protected getSelfcareCustomerBills(): Observable<TmaCustomerBills[]> {
        return this.selfcareService.getCustomerBills();
    }

    /**
     * Represents Get Current key
     * @returns Current Key
     */
    public getCurrentKey(): Observable<string> {
        return this.routing
            .getParams()
            .pipe(pluck(CUSTOMER_BILLS.KEY), distinctUntilChanged());
    }

    /**
     * Navigates to the detailed view of the selected list item.
     */
    public launchItem(item: TmaCustomerBills): void {
        const cxRoute = CUSTOMER_BILLS.ROUTE;
        const params = item;
        if (cxRoute && item && Object.keys(item).length > 0) {
            window.scroll(0, 0);
            this.routing.go({ cxRoute, params });
        }
    }

    /**
     * Implements getTableStructure
     * @returns Table Structure
     */
    private getTableStructure(): TableStructure {
        const structure: TableStructure = {
            type: CUSTOMER_BILLS.CELL_DOMAIN_TYPE,
            cells: CUSTOMER_BILLS.CELLS,
            options: {
                layout: TableLayout.VERTICAL,
                cells: {
                    billNo: {
                        dataComponent: TmaActiveLinkCellComponent
                    },
                    category: {
                        dataComponent: TmaCellComponent
                    },
                    state: {
                        dataComponent: TmaBillingStateCellComponent
                    },
                    id: {
                        dataComponent: TmaCellComponent
                    }
                }
            }
        };

        return structure;
    }
}
