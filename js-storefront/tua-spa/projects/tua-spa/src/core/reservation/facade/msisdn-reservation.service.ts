// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable, OnDestroy } from '@angular/core';
import { Reservation, ResourceRef, TmaProduct } from '../../model';
import { ReservationAction, StateWithReservation } from '../store';
import { OCC_USER_ID_ANONYMOUS } from '@spartacus/core';
import { LOCAL_STORAGE } from '../../util';
import { AvailabilityCheckService } from '../../availability-check/facade';
import { LogicalResourceReservationService } from './logical-resource-reservation.service';
import { Store } from '@ngrx/store';
import { JourneyChecklistConfig } from '../../config';
import { filter, take, takeUntil } from 'rxjs/operators';
import { UserAccountFacade } from '@spartacus/user/account/root';
import { Subscription } from 'rxjs';

const { MSISDN_TYPE } = LOCAL_STORAGE.MSISDN_RESERVATION;

@Injectable()
export class MsisdnReservationService extends LogicalResourceReservationService implements OnDestroy {

  protected subscription = new Subscription();

  constructor(
    protected store: Store<StateWithReservation>,
    protected userAccountFacade: UserAccountFacade,
    protected availabilityCheckService: AvailabilityCheckService,
    protected config: JourneyChecklistConfig
  ) {
    super(store, userAccountFacade);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Creates reservation for logical resource selected by user from the list of available logical resources
   *
   * @param product - The product for which the MSISDN will be reserved
   */
  public createReservationFor(product: TmaProduct): void {
    let selectedMsisdn: ResourceRef;
    this.subscription.add(
      this.availabilityCheckService.getSelectedLogicalResource().pipe(
        filter((result: ResourceRef) => !!result),
        take(2)
      )
        .subscribe((result: ResourceRef) => {
          selectedMsisdn = result;
        })
      );
    if (!selectedMsisdn) {
      return;
    }
    let reservation: Reservation;
    if (
      this.currentUser.id === OCC_USER_ID_ANONYMOUS ||
      this.currentUser.id === undefined
    ) {
      reservation = {
        productOffering: {
          id: product.code,
          name: product.name
        },
        reservationItem: [
          {
            quantity: this.config.journeyChecklist.msisdn_reservation
              .msisdn_qty,
            resourceCapacity: [
              {
                capacityDemandAmount: this.config.journeyChecklist
                  .msisdn_reservation.msisdn_capacity_amount_demand,
                type: MSISDN_TYPE
              }
            ],
            appliedCapacityAmount: [
              {
                appliedCapacityAmount: this.config.journeyChecklist
                  .msisdn_reservation
                  .applied_capacity_amount_for_msisdn_reservation,
                resource: Object.values(selectedMsisdn)
              }
            ]
          }
        ]
      };
    }
    else {
      reservation = {
        relatedParty: [
          {
            id: this.currentUser.id,
            role: this.currentUser.role
          }
        ],
        productOffering: {
          id: product.code,
          name: product.name
        },
        reservationItem: [
          {
            quantity: this.config.journeyChecklist.msisdn_reservation.msisdn_qty,
            resourceCapacity: [
              {
                capacityDemandAmount: this.config.journeyChecklist
                  .msisdn_reservation.msisdn_capacity_amount_demand,
                type: MSISDN_TYPE
              }
            ],
            appliedCapacityAmount: [
              {
                appliedCapacityAmount: this.config.journeyChecklist
                  .msisdn_reservation
                  .applied_capacity_amount_for_msisdn_reservation,
                resource: Object.values(selectedMsisdn)
              }
            ]
          }
        ]
      };
    }
    this.store.dispatch(new ReservationAction.CreateReservation(reservation));
  }
}
