// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { TmaCustomerBills } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { CUSTOMER_BILLS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-related-party',
  templateUrl: './related-party.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class CustomerBillRelatedPartyComponent {
  readonly domainType = CUSTOMER_BILLS.RELATED_PARTY_DOMAIN_TYPE;
  readonly model$: Observable<TmaCustomerBills> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getCustomerBillDetails(code))
  );

  constructor(
    protected selfcareService: SelfcareService,
    protected routingService: RoutingService
  ) {}

  /**
   * Represents Get Current key
   * @returns Current Key
   */
  private getCurrentKey(): Observable<string> {
    return this.routingService
      .getParams()
      .pipe(pluck(CUSTOMER_BILLS.KEY), distinctUntilChanged());
  }
}
