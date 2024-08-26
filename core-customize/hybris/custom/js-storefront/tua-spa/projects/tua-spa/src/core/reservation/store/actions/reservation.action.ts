// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Action } from '@ngrx/store';

export enum ReservationActionTypes {
  CREATE_RESERVATION_POOL_MANAGEMENT = '[Reservation] Create Reservation Pool Management',
  CREATE_RESERVATION_POOL_MANAGEMENT_SUCCESS = '[Reservation] Create Reservation Pool Management Success',
  CREATE_RESERVATION_POOL_MANAGEMENT_FAIL = '[Reservation] Create Reservation Pool Management Fail',
  CLEAR_RESERVATION_POOL_MANAGEMENT = '[Reservation] Clear Reservation Pool Management',
  UPDATE_RESERVATION_POOL_MANAGEMENT = '[Reservation] Update Reservation Pool Management',
  UPDATE_RESERVATION_POOL_MANAGEMENT_SUCCESS = '[Reservation] Update Reservation Pool Management Success',
  UPDATE_RESERVATION_POOL_MANAGEMENT_FAIL = '[Reservation] Update Reservation Pool Management fail',
  LOAD_RESERVATION_POOL_MANAGEMENT = '[Reservation] load Reservation Pool Management',
  LOAD_RESERVATION_POOL_MANAGEMENT_SUCCESS = '[Reservation] load Reservation Pool Management Success',
  LOAD_RESERVATION_POOL_MANAGEMENT_FAIL = '[Reservation] load Reservation Pool Management Fail',
  CLEAR_RESERVATION_ERROR = '[Reservation] Clear Reservation Error',
  CLEAR_UPDATE_RESERVATION_ERROR = '[Reservation] Clear Update Reservation Error',
  CLEAR_CREATED_RESERVATION = '[Reservation] Clear Created Reservation Error',
  CLEAR_INVALID_RESERVATIONS = '[Reservation] Clear Invalid Reservations',
}

export class CreateReservation implements Action {
  readonly type = ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT;

  constructor(public payload: any) {
  }
}

export class CreateReservationSuccess implements Action {
  readonly type =
    ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateReservationFail implements Action {
  readonly type =
    ReservationActionTypes.CREATE_RESERVATION_POOL_MANAGEMENT_FAIL;

  constructor(public payload: any) {
  }
}

export class UpdateReservation implements Action {
  readonly type = ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT;

  constructor(public payload: any) {
  }
}

export class UpdateReservationSuccess implements Action {
  readonly type =
    ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateReservationFail implements Action {
  readonly type =
    ReservationActionTypes.UPDATE_RESERVATION_POOL_MANAGEMENT_FAIL;

  constructor(public payload: any) {
  }
}

export class LoadReservation implements Action {
  readonly type = ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT;

  constructor(public payload: any) {
  }
}

export class LoadReservationSuccess implements Action {
  readonly type =
    ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadReservationFail implements Action {
  readonly type = ReservationActionTypes.LOAD_RESERVATION_POOL_MANAGEMENT_FAIL;

  constructor(public payload: any) {
  }
}

export class ClearReservation implements Action {
  readonly type = ReservationActionTypes.CLEAR_RESERVATION_POOL_MANAGEMENT;

  constructor() {
  }
}

export class ClearCreatedReservation implements Action {
  readonly type = ReservationActionTypes.CLEAR_CREATED_RESERVATION;

  constructor() {
  }
}

export class ClearReservationError implements Action {
  readonly type = ReservationActionTypes.CLEAR_RESERVATION_ERROR;

  constructor() {
  }
}

export class ClearUpdateReservationError implements Action {
  readonly type = ReservationActionTypes.CLEAR_UPDATE_RESERVATION_ERROR;

  constructor() {
  }
}

export class ClearInvalidReservations implements Action {
  readonly type = ReservationActionTypes.CLEAR_INVALID_RESERVATIONS;

  constructor(public payload: any) {
  }
}

export type ReservationAction =
  | CreateReservation
  | CreateReservationSuccess
  | CreateReservationFail
  | ClearReservation
  | UpdateReservation
  | UpdateReservationSuccess
  | UpdateReservationFail
  | LoadReservation
  | LoadReservationSuccess
  | LoadReservationFail
  | ClearReservationError
  | ClearUpdateReservationError
  | ClearCreatedReservation
  | ClearInvalidReservations;
