// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '@spartacus/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, pluck, switchMap } from 'rxjs/operators';
import { ContactMedium, TmaBillingAccounts } from '../../../../../../core/model';
import { SelfcareService } from '../../../../../../core/selfcare/facade';
import { LOCAL_STORAGE } from '../../../../../../core/util/constants';

const { BILLING_ACCOUNTS } = LOCAL_STORAGE.SELFCARE;

@Component({
  selector: 'cx-contact-details',
  templateUrl: './contact-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' }
})
export class ContactDetailsComponent {
  readonly domainType = BILLING_ACCOUNTS.CONTACT_DETAILS_DOMAIN_TYPE;
  readonly model$: Observable<TmaBillingAccounts> = this.getCurrentKey().pipe(
    switchMap((code) => this.selfcareService.getBillingAccountDetails(code))
  );

  readonly getContactDetails$: Observable<ContactMedium> =
    this.getContactMedium().pipe(
      switchMap((contactMedium) =>
        this.model$.pipe(
          map((billingAccounts: TmaBillingAccounts) =>
            billingAccounts.contact
              .map((item) => item.contactMedium)[0]
              ?.find(
                (medium: ContactMedium) => medium.mediumType === contactMedium
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
   * Get Balance Type
   */
  private getContactMedium(): Observable<string> {
    return this.activatedRoute.params.pipe(
      pluck(BILLING_ACCOUNTS.CONTACT_MEDIUM),
      distinctUntilChanged()
    );
  }
}
