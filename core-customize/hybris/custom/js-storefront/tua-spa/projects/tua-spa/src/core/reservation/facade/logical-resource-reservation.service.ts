// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { filter, first, take } from 'rxjs/operators';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { LogicalResource, Reservation, ResourceRef, TmaTmfRelatedParty, TmaTmfRelatedPartyRole } from '../../model';
import { ReservationAction, ReservationSelectors, StateWithReservation } from '../store';
import { User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Injectable()
export class LogicalResourceReservationService implements OnDestroy {
  protected subscription = new Subscription();
  protected currentUser: TmaTmfRelatedParty;

  constructor(
    protected store: Store<StateWithReservation>,
    protected userAccountFacade: UserAccountFacade
  ) {
    this.subscription.add(
      this.userAccountFacade
        .get()
        .pipe(first((user: User) => user != null))
        .subscribe((customer: User) => {
          if(customer !== undefined) {
            this.currentUser = {
              id: customer && customer.uid,
              role: TmaTmfRelatedPartyRole.CUSTOMER,
              name: customer.name
            };
          }
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * This method is used to clear the invalid reservations.
   *
   * @param logicalResources LogicalResource[]
   *            List of invalid logical resource to be removed from state.
   *
   */
  public clearInvalidReservations(logicalResources: LogicalResource[]): void {
    const reservations: Reservation[] = [];
    logicalResources.forEach((logicalResource: LogicalResource) => {
      this.subscription.add(
        this.getReservationByLogicalResourceValue(logicalResource.value)
          .pipe(
            take(2),
            filter((result: Reservation) => !!result)
          )
          .subscribe((result: Reservation) => {
            reservations.push(result);
          })
        );
    });
    this.store.dispatch(
      new ReservationAction.ClearInvalidReservations({
        invalidReservations: reservations
      })
    );
  }

  /**
   * This method is used to clear the reservation error.
   */
  public clearReservationError(): void {
    this.store.dispatch(new ReservationAction.ClearReservationError());
  }

  /**
   * This method is used to clear the update reservation error.
   */
  public clearUpdateReservationError(): void {
    this.store.dispatch(new ReservationAction.ClearUpdateReservationError());
  }

  /**
   * This method is used to fetch the created reservation details.
   *
   * @return
   *       the details of created reservation
   */
  public getCreatedReservation(): Observable<Reservation> {
    return this.store.pipe(select(ReservationSelectors.getCreatedReservation));
  }

  /**
   * This method is used to determine error during reservation creation.
   *
   * @return
   *        the error message indicating error occurred during reservation creation.
   */
  public getCreateReservationError(): Observable<string> {
    return this.store.pipe(
      select(ReservationSelectors.getCreateReservationError)
    );
  }

  /**
   * This method will return the reservation based on logical Resource value.
   *
   *  @param resourceValue
   *            the resource value
   *  @return
   *         the reservation based on logical Resource value.
   */
  public getReservationByLogicalResourceValue(
    resourceValue: string
  ): Observable<Reservation> {
    return this.store.pipe(
      select(ReservationSelectors.getReservationByLogicalResourceValue, {
        resourceValue: resourceValue
      })
    );
  }

  /**
   * This method is used to determine the reservation error during update.
   *
   * @param cartEntryResourceValue
   *             The selected logical resource value for the cart entry
   * @return
   *       the error message indicating error occurred while updating reservation.
   */
  public getUpdateReservationError(
    cartEntryResourceValue: string
  ): Observable<string> {
    let reservationId: string;
    this.subscription.add(
      this.getReservationByLogicalResourceValue(cartEntryResourceValue)
        .pipe(
          filter((result: Reservation) => !!result),
          take(1)
        )
        .subscribe((result: Reservation) => {
          reservationId = result.id;
        })
      );
    return this.store.pipe(
      select(ReservationSelectors.getUpdateReservationError, {
        reservationId: reservationId
      })
    );
  }

  /**
   * This method is used to determine if there are any cancelled reservation.
   *
   * @return
   *       true if there are cancelled/rejected reservations in cart
   */
  public hasCancelledReservations(): Observable<boolean> {
    return this.store.pipe(
      select(ReservationSelectors.hasCancelledReservations)
    );
  }

  /**
   * This method is used to determine if reservation is cancelled/rejected for cart entry.
   *
   * @param cartEntryResourceValue
   *             The selected logical resource value for the cart entry
   * @return
   *       true if reservation is cancelled/rejected
   */
  public hasCancelledReservationForEntry(
    cartEntryResourceValue: string
  ): Observable<boolean> {
    return this.store.pipe(
      select(ReservationSelectors.hasReservationCancelled, {
        resourceValue: cartEntryResourceValue
      })
    );
  }

  /**
   * This method is used to determine if reservation has any error.
   *
   * @return
   *       true if reservation has error
   */
  public hasReservationError(): Observable<boolean> {
    return this.store.pipe(select(ReservationSelectors.hasReservationError));
  }

  /**
   * This method is used to load the reservations based on user and resource value.
   *
   * @param cartEntryResourceValues
   *             The selected logical resource values for the cart entry
   **/
  public loadReservationByUserIdAndResource(
    cartEntryResourceValues: string[]
  ): void {
    this.store.dispatch(
      new ReservationAction.LoadReservation({
        id: this.currentUser?.id,
        cartEntryResourceValues: cartEntryResourceValues
      })
    );
  }

  /**
   * Clears the reservation state.
   */
  public clearReservationState(): void {
    this.store.dispatch(new ReservationAction.ClearReservation());
  }

  /**
   * Clears the created reservation state.
   */
  public clearCreatedReservationState(): void {
    this.store.dispatch(new ReservationAction.ClearCreatedReservation());
  }

  /**
   * Update reservation for logical resource.
   *
   *  @param resourceRef
   *          The new resource to be updated as {@link ResourceRef}
   *  @param reservationId
   *           The selected logical resource reservation id for the cart entry as {@link string}
   */
  public updateReservationFor(
    resourceRef: ResourceRef,
    reservationId: string
  ): void {
    const updatedReservation = {
      value: resourceRef,
      op: 'replace'
    };
    this.store.dispatch(
      new ReservationAction.UpdateReservation({
        updatedReservation: updatedReservation,
        reservationId: reservationId
      })
    );
  }
}
