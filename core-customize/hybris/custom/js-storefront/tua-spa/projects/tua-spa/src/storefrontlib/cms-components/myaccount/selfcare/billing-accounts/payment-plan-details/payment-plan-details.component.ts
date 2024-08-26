// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { TmaBillingAccounts, TmaPaymentPlan } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { BILLING_ACCOUNTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-payment-plan-details',
  templateUrl: './payment-plan-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class PaymentPlanDetailsComponent {
  readonly domainType = BILLING_ACCOUNTS.PAYMENT_PLAN_DETAILS_DOMAIN_TYPE;
  readonly model$: Observable<TmaBillingAccounts> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getBillingAccountDetails(code))
  );

  readonly getPaymentDetails$: Observable<TmaPaymentPlan> =
    this.getPaymentId().pipe(
      switchMap((paymentId) =>
        this.model$.pipe(
          map((billingAccounts: TmaBillingAccounts) =>
            billingAccounts.paymentPlan.find(
              (item: TmaPaymentPlan) => item.paymentMethod.id === paymentId
            )
          )
        )
      )
    );

  constructor(
    protected selfcareService: SelfcareService,
    protected routingService: RoutingService,
    protected activatedRoute: ActivatedRoute
  ) {}

  /**
   * Represents Get Current key
   * @returns Current Key
   */
  private getCurrentKey(): Observable<string> {
    return this.routingService
      .getParams()
      .pipe(pluck(BILLING_ACCOUNTS.KEY), distinctUntilChanged());
  }

  /**
   * Get Payment Id
   */
  private getPaymentId(): Observable<string> {
    return this.activatedRoute.params.pipe(
      pluck(BILLING_ACCOUNTS.PAYMENT_ID),
      distinctUntilChanged()
    );
  }
}
