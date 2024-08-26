// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { TableLayout, TableStructure } from '@spartacus/storefront';
import { TmfSelfcareTreeService } from '../../../../../core/tmf/adapters/selfcare';
import { SelfcareService } from '../../../../../core/selfcare/facade';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { TmaActiveLinkCellComponent } from '../../../shared/tma-table/tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from '../../../shared/tma-table/tma-cell.component';
import { TmaAgreementStatusCellComponent } from '../../../shared/tma-table/tma-status/tma-agreement-status-cell.component';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { TmaBillingAgreements } from '../../../../../core/model';

const { BILLING_AGREEMENTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-table',
  templateUrl: 'selfcare-billing-agreements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelfcareBillingAgreementsComponent implements OnInit {
  readonly key = BILLING_AGREEMENTS.KEY;
  readonly domainType = BILLING_AGREEMENTS.DOMAIN_TYPE;
  public listData$: Observable<TmaBillingAgreements[]>;
  public structure$: TableStructure;

  constructor(
    protected selfcareService: SelfcareService,
    protected selfcareTreeService: TmfSelfcareTreeService,
    protected routing: RoutingService
  ) { }

  ngOnInit() {
    this.structure$ = this.getTableStructure();
    this.listData$ = this.getSelfcareBillingAgreements();
  }

/**
 * Get selfcare billing agreements
 * @returns TmaBillingAgreements
 */
 protected getSelfcareBillingAgreements(): Observable<TmaBillingAgreements[]> {
  return this.selfcareService.getBillingAgreements();
}

  /**
   * Represents Get Current key
   * @returns Current Key
   */
   public getCurrentKey(): Observable<string> {
    return this.routing
      .getParams()
      .pipe(pluck(BILLING_AGREEMENTS.KEY), distinctUntilChanged());
  }

  /**
   * Navigates to the detailed view of the selected list item.
   */
  public launchItem(item: TmaBillingAgreements): void {
    const cxRoute = BILLING_AGREEMENTS.ROUTE;
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
  private getTableStructure(): TableStructure{
    const structure: TableStructure = {
      type: BILLING_AGREEMENTS.CELL_DOMAIN_TYPE,
      cells: BILLING_AGREEMENTS.CELLS,
      options: {
        layout: TableLayout.VERTICAL,
        cells: {
          name:{
            dataComponent: TmaActiveLinkCellComponent
          },
          agreementType: {
            dataComponent: TmaCellComponent
          },
          status:{
            dataComponent: TmaAgreementStatusCellComponent
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
