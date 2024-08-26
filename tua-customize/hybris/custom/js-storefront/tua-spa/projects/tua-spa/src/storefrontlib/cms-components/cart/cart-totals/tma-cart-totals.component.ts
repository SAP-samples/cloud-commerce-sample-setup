// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import {
  AppointmentService,
  JourneyChecklistConfig,
  LogicalResourceReservationService,
  LogicalResourceType,
  TmaActiveCartFacade,
  TmaCart,
  TmaCharacteristic,
  TmaChecklistAction,
  TmaChecklistActionService,
  TmaChecklistActionType,
  TmaMessage,
  TmaOrderEntry,
  TmaPlace,
  TmaPlaceRole,
  TmaTmfCartService,
  TmaValidationMessageType
} from '../../../../core';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { BaseSiteService } from '@spartacus/core';
import { Observable, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { OrderEntry } from '@spartacus/cart/base/root';
import { CartTotalsComponent } from '@spartacus/cart/base/components';

@Component({
  selector: 'cx-cart-totals',
  templateUrl: './tma-cart-totals.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TmaCartTotalsComponent extends CartTotalsComponent
  implements OnInit, OnDestroy {
  entries$: Observable<OrderEntry[]>;
  hasAppointmentError$: Observable<boolean>;
  hasCancelledAppointment$: Observable<boolean>;
  hasReservationError$: Observable<boolean>;
  hasCancelledReservations$: Observable<boolean>;
  hasChecklistFulfilled: boolean = true;
  baseSiteId: string;
  protected subscription = new Subscription();

  constructor(
    protected activeCartService: TmaActiveCartFacade,
    protected appointmentService: AppointmentService,
    public checklistActionService?: TmaChecklistActionService,
    public tmfCartService?: TmaTmfCartService,
    protected logicalResourceReservationService?: LogicalResourceReservationService,
    protected baseSiteService?: BaseSiteService,
    protected config?: JourneyChecklistConfig
  ) {
    super(activeCartService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.entries$ = this.activeCartService
      .getEntries()
      .pipe(filter((entries) => entries.length > 0));

    this.subscription.add(
      this.baseSiteService
        .getActive()
        .pipe(first((baseSiteId: string) => !!baseSiteId))
        .subscribe((baseSiteId: string) => (this.baseSiteId = baseSiteId))
    );

    this.hasAppointmentError$ = this.appointmentService.hasAppointmentError();
    this.hasCancelledAppointment$ = this.appointmentService.hasCancelledAppointment();
    this.hasReservationError$ = this.logicalResourceReservationService.hasReservationError();
    this.hasCancelledReservations$ = this.logicalResourceReservationService.hasCancelledReservations();

  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Checks if cart has compatibility errors.
   *
   * @param cart - The cart
   * @return True if cart has compatibility errors, otherwise false
   */
  hasCompatibilityErrors(cart: TmaCart): boolean {
    return (
      this.hasCompatibilityErrorsOnCartLevel(cart) ||
      this.hasCompatibilityErrorsOnEntryLevel(cart)
    );
  }
  /**
   * Checks if checklist are fulfilled then enable the checkout button
   *
   * @param checklistResult list of {@link TmaChecklistAction}
   * @param entry of {@link TmaOrderEntry}
   */
  enableCheckout(
    checklistResult: TmaChecklistAction[],
    entry: TmaOrderEntry
  ): void {
    let checklistActionsFulfilled: boolean = true;
    let appointmentSelected: boolean = true;
    let installationAddressSelected: boolean = true;
    let msisdnSelected: boolean = true;

    if (Object.keys(checklistResult).length !== 0) {
      const journeyCheckLists: TmaChecklistAction[] = checklistResult.filter(
        (checklist: TmaChecklistAction) =>
          this.config.journeyChecklist.journeyChecklistSteps.includes(
            checklist.actionType
          )
      );
      if (Object.keys(journeyCheckLists).length !== 0) {
        const checklistActionTypes: string[] = journeyCheckLists.map(
          (checklist: TmaChecklistAction) => checklist.actionType
        );

        if (checklistActionTypes && checklistActionTypes.length > 0) {
          if (
            checklistActionTypes.includes(TmaChecklistActionType.APPOINTMENT)
          ) {
            appointmentSelected = this.hasAppointment(entry);
          }
          if (
            checklistActionTypes.includes(
              TmaChecklistActionType.INSTALLATION_ADDRESS
            )
          ) {
            installationAddressSelected = this.hasInstallationAddress(entry);
          }
          if (checklistActionTypes.includes(TmaChecklistActionType.MSISDN)) {
            msisdnSelected = this.hasMsisdn(entry);
          }
        }
        checklistActionsFulfilled =
          appointmentSelected && installationAddressSelected && msisdnSelected;
        this.hasChecklistFulfilled = checklistActionsFulfilled;
      }
    }
  }

  /**
   * Resets the checklist Fulfilled if there cart entry is updated
   */
  resetChecklist(): void {
    this.hasChecklistFulfilled = true;
  }

  protected hasCompatibilityErrorsOnCartLevel(cart: TmaCart): boolean {
    return (
      cart.message &&
      !!cart.message.find(
        (validationMessage: TmaMessage) =>
          validationMessage.type === TmaValidationMessageType.COMPATIBILITY
      )
    );
  }

  protected hasCompatibilityErrorsOnEntryLevel(cart: TmaCart): boolean {
    let hasCompatibilityErrors = false;
    cart.entries.forEach((tmaEntry: TmaOrderEntry) => {
      hasCompatibilityErrors = tmaEntry.validationMessages ?
        true :
        this.getCompatibilityErrorsForEntry(tmaEntry, hasCompatibilityErrors);
    });
    return hasCompatibilityErrors;
  }

  protected getCompatibilityErrorsForEntry(entry: TmaOrderEntry, hasCompatibilityErrors: boolean): boolean {
    if (!entry || !entry.entries) {
      return hasCompatibilityErrors;
    }

    entry.entries.forEach((tmaEntry: TmaOrderEntry) => {
      if (tmaEntry.validationMessages) {
        hasCompatibilityErrors = true;
      }
    });

    if (hasCompatibilityErrors) {
      return hasCompatibilityErrors;
    }

    entry.entries.forEach((tmaEntry: TmaOrderEntry) => {
      if (tmaEntry.validationMessages) {
        hasCompatibilityErrors = this.getCompatibilityErrorsForEntry(tmaEntry, hasCompatibilityErrors);
      }
    });

    return hasCompatibilityErrors;
  }

  protected hasInstallationAddress(entry: TmaOrderEntry): boolean {
    return !!(entry &&
      entry.subscribedProduct &&
      entry.subscribedProduct.place &&
      entry.subscribedProduct.place.find(
        (place: TmaPlace) => place.role === TmaPlaceRole.INSTALLATION_ADDRESS
      ));
  }

  protected hasMsisdn(entry: TmaOrderEntry): boolean {
    return !!(entry &&
      entry.subscribedProduct &&
      entry.subscribedProduct.characteristic &&
      entry.subscribedProduct.characteristic.find(
        (tmaCharacteristic: TmaCharacteristic) =>
          tmaCharacteristic.name === LogicalResourceType.MSISDN
      ));
  }

  protected hasAppointment(entry: TmaOrderEntry): boolean {
    return !!(entry && entry.appointment && entry.appointment.id);
  }
}
