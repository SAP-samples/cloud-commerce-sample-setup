// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';
import { TmaBillingAgreements } from '../../../../../../core/model';

const { BILLING_AGREEMENTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-specification-details',
  templateUrl: './specification-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class SpecificationDetailsComponent{
  readonly domainType = BILLING_AGREEMENTS.AGREEMENT_SPECIFICATION_DETAILS_DOMAIN_TYPE;
  readonly model$: Observable<TmaBillingAgreements> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getBillingAgreementDetails(code))
  );

  constructor(
    protected routingService: RoutingService,
    protected selfcareService: SelfcareService
  ){}

  /**
   * Represents Get Current key
   * @returns Current Key
   */
   private getCurrentKey(): Observable<string>{
    return this.routingService
    .getParams()
    .pipe(pluck(BILLING_AGREEMENTS.KEY), distinctUntilChanged());
  }
}
