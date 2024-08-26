// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Reservation } from '../../model';

export const RESERVATION_POOL_MANAGEMENT_FEATURE =
  'reservation-pool-management-feature';

export interface StateWithReservation {
  [RESERVATION_POOL_MANAGEMENT_FEATURE]: ReservationState;
}

export interface ReservationState {
  reservations?: Reservation[];
  newReservation?: Reservation;
  reservationErrors?: ReservationError[];
  updateReservationError?: ReservationError;
}

export interface ReservationError {
  reservationId?: string;
  reservationError?: string;
}
