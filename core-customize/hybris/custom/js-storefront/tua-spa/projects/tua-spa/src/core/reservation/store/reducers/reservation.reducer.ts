// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AppliedCapacityAmount, Reservation, ReservationItem, ResourceRef } from '../../../model';
import { ReservationAction, ReservationActionTypes } from '../actions/reservation.action';
import { ReservationError } from '../reservation.state';

export const reservationInitialState: Reservation[] = [];
export const createReservationInitialState: Reservation = {};
export const errorInitialState: ReservationError[] = [];
export const updateReservationErrorInitialState: ReservationError = {};

/**
 *  Function to handle the transitions of reservation in ReservationState
 *
 * @param state
 *          The state of ReservationState
 * @param  action
 *          Dispatched action of {@link ReservationState}
 * @return
 *       list of Reservations
 */
export function reservationReducer(
  state = reservationInitialState,
  action: ReservationAction
): Reservation[] {
  switch (action.type) {
    case ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT_SUCCESS: {
      return state.map((reservation: Reservation) =>
        reservation.id === action.payload.reservation.id
          ? { ...action.payload.reservation }
          : reservation
      );
    }

case ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT_SUCCESS: {
  if (!action.payload.reservation) {
    return state;
  }
  action.payload.reservation.forEach((reservationEntry: Reservation) => {
    reservationEntry.reservationItem.forEach((item: ReservationItem) => {
      item.appliedCapacityAmount.forEach((appliedCapacity: AppliedCapacityAmount) => {
        appliedCapacity.resource.forEach((logicalResource: ResourceRef) => {
          if (action.payload.resourceValues.indexOf(logicalResource.value) > -1) {
            state = state.concat({
              ...reservationEntry
            });
          }
        });
      });
    });
  });
  return state;
}

    case ReservationActionTypes.CLEAR_RESERVATION_POOL_MANAGEMENT: {
      return reservationInitialState;
    }
    case ReservationActionTypes.CLEAR_INVALID_RESERVATIONS: {
      if (!action.payload.invalidReservations) {
        return state;
      }
        return state.filter(
          (item: Reservation) =>
            action.payload.invalidReservations.indexOf(item) === -1
        );
      }
    }

  return state;
}

/**
 *  Function to handle the transitions of newReservation in ReservationState
 *
 * @param state
 *          The state of ReservationState
 * @param  action
 *          Dispatched action of {@link ReservationState}
 * @return
 *       newly created reservation
 */
export function createReservationReducer(
  state = createReservationInitialState,
  action: ReservationAction
): Reservation {
  switch (action.type) {
    case ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT_SUCCESS: {
      return action.payload.reservation;
    }
    case ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT_SUCCESS: {
      return state.id === action.payload.reservation.id
          ? { ...action.payload.reservation }
          : state;
    }
    case ReservationActionTypes.CLEAR_CREATED_RESERVATION: {
      return createReservationInitialState;
    }
  }
  return state;
}

/**
 *  Function to handle the transitions of reservationErrors in ReservationState
 *
 * @param state
 *          The state of ReservationState
 * @param  action
 *          Dispatched action of {@link ReservationState}
 * @return
 *        Array of errors
 */
export function reservationErrorReducer(
  state = errorInitialState,
  action: ReservationAction
): ReservationError[] {
  switch (action.type) {
    case ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT_FAIL: {
      if (
        !state.find(
          (error: ReservationError) => error.reservationId === action.payload.id
        )
      ) {
        state = state.concat({
          reservationError: action.payload.errorResponse,
          reservationId: action.payload.id
        });
      }
      return state;
    }
    case ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT_FAIL: {
      state = state.concat({
        reservationError: action.payload.errorResponse
      });
      return state;
    }
    case ReservationActionTypes.CLEAR_RESERVATION_ERROR: {
      return errorInitialState;
    }
  }
  return state;
}

/**
 *
 *  Function to handle the transitions of updateReservationError in ReservationState
 *
 * @param state
 *          The state of ReservationState
 * @param  action
 *          Dispatched action of {@link ReservationState}
 * @return
 *        Error while updating reservation
 */
export function updateReservationErrorReducer(
  state = updateReservationErrorInitialState,
  action: ReservationAction
): ReservationError {
  switch (action.type) {
    case ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT_FAIL: {
      state = {
        reservationError: action.payload.errorResponse,
        reservationId: action.payload.id
      };
      return state;
    }
    case ReservationActionTypes.CLEAR_UPDATE_RESERVATION_ERROR: {
      return updateReservationErrorInitialState;
    }
  }
  return state;
}
