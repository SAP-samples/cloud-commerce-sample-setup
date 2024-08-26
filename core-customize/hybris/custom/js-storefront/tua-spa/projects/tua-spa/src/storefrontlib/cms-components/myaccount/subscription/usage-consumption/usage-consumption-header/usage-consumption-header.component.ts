// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsageConsumptionService } from '../../../../../../core/subscription';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UsageConsumptionReport } from '../../../../../../core';

@Component({
  selector: 'cx-usage-consumption-header',
  templateUrl: './usage-consumption-header.component.html',
  styleUrls: ['./usage-consumption-header.component.scss'],
})
export class UsageConsumptionHeaderComponent implements OnInit, OnDestroy {
  subscriptionId: string;
  usageConsumptionReport$: Observable<UsageConsumptionReport>;
  protected subscription = new Subscription();

  constructor(
    protected subscriptionService: UsageConsumptionService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.params
        .pipe(
          filter((params: Params) => !!params)
        )
        .subscribe((params: Params) => {
          this.subscriptionId = params['subscriptionId'];
        })
    );
    this.usageConsumptionReport$ = this.fetchUsageConsumptionReport();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionService.clearUsageConsumptionDetails();
  }

  fetchUsageConsumptionReport(): Observable<UsageConsumptionReport> {
    return this.subscriptionService.fetchUsageConsumption(this.subscriptionId);
  }
}
