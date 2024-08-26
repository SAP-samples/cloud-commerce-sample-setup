// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { Reservation } from '../../../model';

export abstract class ReservationAdapter {

  /**
   * Abstract method used to create reservation
   *
   * @param reservation
   *          Reservation to be create
   * @return
   *       Created reservation
   */
  abstract createReservation(reservation: Reservation): Observable<Reservation>;

  /**
   * Abstract method used to update the reservation
   *
   * @param updateReservation
   *              Reservation to be update
   * @param reservationId
   *               Id of the reservation
   * @return
   *        Updated reservation
   */
  abstract updateReservation(
    updateReservation: Reservation,
    reservationId: string
  ): Observable<Reservation>;

  /**
   * Abstract method used to get Reservations based on user
   *
   * @param userId
   *        user id
   * @param  cartEntryResourceValues
   *              cart entry resource value
   * @return
   *       List of Reservations
   */
  abstract getReservationsByUserId(
    userId: string,
    cartEntryResourceValues: string[]
  ): Observable<Reservation[]>;
}
