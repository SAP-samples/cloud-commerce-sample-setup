// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { TableLayout, TableStructure } from '@spartacus/storefront';
import { TmfSelfcareTreeService } from '../../../../../core/tmf/adapters/selfcare/facade/tmf-selfcare-tree-service';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck } from 'rxjs/operators';
import { TmaBillingAccounts } from '../../../../../core/model';
import { SelfcareService } from '../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../core/util/constants';
import { TmaActiveLinkCellComponent } from '../../../shared/tma-table/tma-active-link/tma-active-link-cell.component';
import { TmaCellComponent } from '../../../shared/tma-table/tma-cell.component';
import { TmaPaymentStatusCellComponent } from '../../../shared/tma-table/tma-status/tma-payment-status-cell.component';

const { BILLING_ACCOUNTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-table',
  templateUrl: 'selfcare-billing-accounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelfcareBillingAccountsComponent implements OnInit {
  readonly key = BILLING_ACCOUNTS.KEY;
  readonly domainType = BILLING_ACCOUNTS.DOMAIN_TYPE;
  public listData$: Observable<TmaBillingAccounts[]>;
  public structure$: TableStructure;

  constructor(
    protected selfcareService: SelfcareService,
    protected selfcareTreeService: TmfSelfcareTreeService,
    protected routing: RoutingService
  ) {}

  ngOnInit() {
    this.structure$ = this.getTableStructure();
    this.listData$ = this.getSelfcareBillingAccounts();
  }

  /**
   * Get selfcare subscriptions
   * @returns TmaSubscriptions
   */
  protected getSelfcareBillingAccounts(): Observable<TmaBillingAccounts[]> {
    return this.selfcareService.getBillingAccounts();
  }

  /**
   * Represents Get Current key
   * @returns Current Key
   */
  public getCurrentKey(): Observable<string> {
    return this.routing
      .getParams()
      .pipe(pluck(BILLING_ACCOUNTS.KEY), distinctUntilChanged());
  }

  /**
   * Navigates to the detailed view of the selected list item.
   */
  public launchItem(item: TmaBillingAccounts): void {
    const cxRoute = BILLING_ACCOUNTS.ROUTE;
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
      type: BILLING_ACCOUNTS.CELL_DOMAIN_TYPE,
      cells: BILLING_ACCOUNTS.CELLS,
      options: {
        layout: TableLayout.VERTICAL,
        cells: {
          name: {
            dataComponent: TmaActiveLinkCellComponent
          },
          accountType: {
            dataComponent: TmaCellComponent
          },
          paymentStatus: {
            dataComponent: TmaPaymentStatusCellComponent
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
