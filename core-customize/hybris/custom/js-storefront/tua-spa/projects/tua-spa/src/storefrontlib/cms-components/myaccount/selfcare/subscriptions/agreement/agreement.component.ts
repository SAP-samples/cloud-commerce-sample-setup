// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { TmaSubscriptions } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { SUBSCRIPTIONS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-selfcare-agreement',
  templateUrl: './agreement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class AgreementComponent {
  readonly domainType = SUBSCRIPTIONS.AGREEMENT_DOMAIN_TYPE;
  readonly model$: Observable<TmaSubscriptions> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getSubscribedProduct(code))
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
      .pipe(pluck(SUBSCRIPTIONS.KEY), distinctUntilChanged());
  }
}
