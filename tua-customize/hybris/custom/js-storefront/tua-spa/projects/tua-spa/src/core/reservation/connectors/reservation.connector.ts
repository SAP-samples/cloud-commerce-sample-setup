// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReservationAdapter } from '../store/adapters';
import { Reservation } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class ReservationConnector {
  constructor(protected adapter: ReservationAdapter) {
  }

  /**
   * This method is used to create reservation for the logical resource e.g. MSISDN
   *
   * @param reservation
   *          Reservation to be create
   * @return
   *           the Created reservation
   */
  public createReservation(reservation: Reservation): Observable<Reservation> {
    return this.adapter.createReservation(reservation);
  }

  /**
   * This method is used to update the reservation for the logical resource e.g. MSISDN
   *
   * @param updateReservation
   *              Reservation to be update
   * @param reservationId
   *               Id of the reservation
   * @return
   *           the Updated reservation
   */
  public updateReservation(
    updateReservation: Reservation,
    reservationId: string
  ): Observable<Reservation> {
    return this.adapter.updateReservation(updateReservation, reservationId);
  }

  /**
   * This method is used to get reservations created for the logical resource e.g. MSISDN for given user
   *
   * @param  userId
   *              id of logged in user
   * @param  cartEntryResourceValues
   *              cart entry resource value
   * @return
   *            list of reservations
   */
  public getReservationsByUserId(
    userId: string,
    cartEntryResourceValues: string[]
  ): Observable<Reservation[]> {
    return this.adapter.getReservationsByUserId(
      userId,
      cartEntryResourceValues
    );
  }
}
