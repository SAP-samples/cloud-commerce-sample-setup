// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { APPOINTMENT_DATA } from '../appointment-state';

export enum AppointmentActionTypes {
  LOAD_APPOINTMENT = '[Appointment] Load Appointment',
  LOAD_APPOINTMENT_SUCCESS = '[Appointment] Load Appointment Success',
  LOAD_APPOINTMENT_FAIL = '[Appointment] Load Appointment Fail',
  CREATE_APPOINTMENT = '[Appointment] Create Appointment',
  CREATE_APPOINTMENT_SUCCESS = '[Appointment] Create Appointment Success',
  CREATE_APPOINTMENT_FAIL = '[Appointment] Create Appointment Fail',
  UPDATE_APPOINTMENT = '[Appointment] Update Appointment',
  UPDATE_APPOINTMENT_SUCCESS = '[Appointment] Update Appointment Success',
  UPDATE_APPOINTMENT_FAIL = '[Appointment] Update Appointment Fail',
  CLEAR_CREATED_APPOINTMENT = '[Appointment] Clear Created Appointment',
  CLEAR_APPOINTMENT_STATE = '[Appointment] Clear Appointment State',
  CLEAR_APPOINTMENT_ERROR = '[Appointment] Clear Appointment Error',
}

export class LoadAppointment extends StateUtils.LoaderLoadAction {
  readonly type = AppointmentActionTypes.LOAD_APPOINTMENT;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class LoadAppointmentSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = AppointmentActionTypes.LOAD_APPOINTMENT_SUCCESS;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class LoadAppointmentFail extends StateUtils.LoaderFailAction {
  readonly type = AppointmentActionTypes.LOAD_APPOINTMENT_FAIL;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class CreateAppointment extends StateUtils.LoaderLoadAction {
  readonly type = AppointmentActionTypes.CREATE_APPOINTMENT;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class CreateAppointmentSuccess extends StateUtils.LoaderSuccessAction {
  readonly type = AppointmentActionTypes.CREATE_APPOINTMENT_SUCCESS;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class CreateAppointmentFail extends StateUtils.LoaderFailAction {
  readonly type = AppointmentActionTypes.CREATE_APPOINTMENT_FAIL;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class UpdateAppointment extends StateUtils.LoaderFailAction {
  readonly type = AppointmentActionTypes.UPDATE_APPOINTMENT;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class UpdateAppointmentSuccess extends StateUtils.LoaderFailAction {
  readonly type = AppointmentActionTypes.UPDATE_APPOINTMENT_SUCCESS;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class UpdateAppointmentFail extends StateUtils.LoaderFailAction {
  readonly type = AppointmentActionTypes.UPDATE_APPOINTMENT_FAIL;
  constructor(public payload: any) {
    super(APPOINTMENT_DATA);
  }
}

export class ClearCreatedAppointment {
  readonly type = AppointmentActionTypes.CLEAR_CREATED_APPOINTMENT;
  constructor() {
    // This is intentional
  }
}

export class ClearAppointmentState {
  readonly type = AppointmentActionTypes.CLEAR_APPOINTMENT_STATE;
  constructor() {
    // This is intentional
  }
}

export class ClearAppointmentError {
  readonly type = AppointmentActionTypes.CLEAR_APPOINTMENT_ERROR;
  constructor() {
    // This is intentional
  }
}

export type AppointmentAction =
  | LoadAppointment
  | LoadAppointmentSuccess
  | LoadAppointmentFail
  | CreateAppointment
  | CreateAppointmentSuccess
  | CreateAppointmentFail
  | UpdateAppointment
  | UpdateAppointmentSuccess
  | UpdateAppointmentFail
  | ClearCreatedAppointment
  | ClearAppointmentState
  | ClearAppointmentError;
