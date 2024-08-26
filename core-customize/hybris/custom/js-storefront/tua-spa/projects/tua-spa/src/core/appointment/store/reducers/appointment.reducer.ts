// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { AppointmentAction, AppointmentActionTypes } from '../actions/appointment.actions';
import { Appointment } from '../../..';
import { AppointmentError } from '../appointment-state';

export const appointmentInitialState: Appointment[] = [];
export const createAppointmentInitialState: Appointment = {};
export const errorInitialState: AppointmentError[] = [];
export const updateAppointmentErrorInitialState: AppointmentError = {};

export function appointmentReducer(
  state = appointmentInitialState,
  action: AppointmentAction
): Appointment[] {
  switch (action.type) {
    case AppointmentActionTypes.CREATE_APPOINTMENT_SUCCESS: {
      return state.concat({
        ...action.payload.newAppointment,
      });
    }
    case AppointmentActionTypes.UPDATE_APPOINTMENT_SUCCESS: {
      return state.map((appointment: Appointment) =>
        appointment.id === action.payload.appointment.id
          ? { ...action.payload.appointment }
          : appointment
      );
    }
    case AppointmentActionTypes.LOAD_APPOINTMENT_SUCCESS: {
      if (
        !state.find(
          (appointment: Appointment) => appointment.id === action.payload.id
        )
      ) {
        state = state.concat({
          ...action.payload,
        });
      }
      return state;
    }
    case AppointmentActionTypes.CLEAR_APPOINTMENT_STATE: {
      return appointmentInitialState;
    }
  }
  return state;
}

export function createAppointmentReducer(
  state = createAppointmentInitialState,
  action: AppointmentAction
): Appointment {
  switch (action.type) {
    case AppointmentActionTypes.CREATE_APPOINTMENT_SUCCESS: {
      return action.payload.newAppointment;
    }
    case AppointmentActionTypes.CLEAR_CREATED_APPOINTMENT: {
      return createAppointmentInitialState;
    }
  }
  return state;
}

export function appointmentErrorReducer(
  state = errorInitialState,
  action: AppointmentAction
): AppointmentError[] {
  switch (action.type) {
    case AppointmentActionTypes.LOAD_APPOINTMENT_FAIL: {
      if (
        !state.find(
          (appointmentError) =>
            appointmentError.appointmentId === action.payload.id
        )
      ) {
        state = state.concat({
          appointmentError: action.payload.errorResponse,
          appointmentId: action.payload.id,
        });
      }
      return state;
    }
    case AppointmentActionTypes.CREATE_APPOINTMENT_FAIL: {
      state = state.concat({
        appointmentError: action.payload.errorResponse,
      });
      return state;
    }
    case AppointmentActionTypes.CLEAR_APPOINTMENT_ERROR: {
      return errorInitialState;
    }
  }
  return state;
}

export function updateAppointmentErrorReducer(
  state = updateAppointmentErrorInitialState,
  action: AppointmentAction
): AppointmentError {
  if (action.type === AppointmentActionTypes.UPDATE_APPOINTMENT_FAIL) {
    {
      state = {
        appointmentError: action.payload.errorResponse,
        appointmentId: action.payload.id,
      };
    }
  }
  return state;
}
