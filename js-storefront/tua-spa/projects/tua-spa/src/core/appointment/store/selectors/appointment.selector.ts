// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { createFeatureSelector, createSelector, MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';
import { APPOINTMENT_FEATURE, AppointmentError, AppointmentState, StateWithAppointment } from '../appointment-state';
import { Appointment } from '../../../model';
import { StateUtils } from '@spartacus/core';
import { AppointmentStateType } from '../../../model/appointment.model';

export const getAppointmentsFeatureState: MemoizedSelector<
  StateWithAppointment,
  AppointmentState
> = createFeatureSelector<AppointmentState>(APPOINTMENT_FEATURE);

export const getAppointmentsState: MemoizedSelector<
  StateWithAppointment,
  StateUtils.LoaderState<Appointment[]>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.appointments
);

export const getAllAppointments: MemoizedSelector<
  StateWithAppointment,
  Appointment[]
> = createSelector(
  getAppointmentsState,
  StateUtils.loaderValueSelector
);

export const getAppointmentById: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  Appointment
> = createSelector(getAllAppointments, (state: Appointment[], props) => {
  return state
    ? state.find((appointment: Appointment) => appointment.id === props.id)
    : undefined;
});

export const getAllAppointmentError: MemoizedSelector<
  StateWithAppointment,
  StateUtils.LoaderState<AppointmentError[]>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.error
);

export const getCreatedAppointmentState: MemoizedSelector<
  StateWithAppointment,
  StateUtils.LoaderState<Appointment>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.newAppointment
);

export const getCreatedAppointment: MemoizedSelector<
  StateWithAppointment,
  Appointment
> = createSelector(
  getCreatedAppointmentState,
  StateUtils.loaderValueSelector
);

export const getAppointmentErrorForAppointmentID: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  string
> = createSelector(
  getAllAppointmentError,
  (state: StateUtils.LoaderState<AppointmentError[]>, props) => {
    const appointmentError = state
      ? state.value.find(
          (errorMap: AppointmentError) => errorMap.appointmentId === props.id
        )
      : undefined;
    return !!appointmentError ? appointmentError.appointmentError : undefined;
  }
);

export const getCreateAppointmentError: MemoizedSelector<
  StateWithAppointment,
  string
> = createSelector(
  getAllAppointmentError,
  (state: StateUtils.LoaderState<AppointmentError[]>) => {
    const createAppointmentError = state.value[0] ? state.value[0] : undefined;
    return !!createAppointmentError ? createAppointmentError.appointmentError : undefined;
  }
);

export const getAppointmentError: MemoizedSelector<
  StateWithAppointment,
  boolean
> = createSelector(
  getAllAppointmentError,
  (state: StateUtils.LoaderState<AppointmentError[]>) => {
    return state.value.length > 0 ? true : false;
  }
);

export const getCancelledAppointment: MemoizedSelector<
  StateWithAppointment,
  boolean
> = createSelector(getAllAppointments, (state: Appointment[]) => {
  return state.find(
    (appointment) => appointment.status === AppointmentStateType.CANCELLED
  )
    ? true
    : false;
});

export const getUpdateAppointmentErrorState: MemoizedSelector<
  StateWithAppointment,
  StateUtils.LoaderState<AppointmentError>
> = createSelector(
  getAppointmentsFeatureState,
  (state: AppointmentState) => state.updateAppointmentError
);

export const getUpdateAppointmentError: MemoizedSelectorWithProps<
  StateWithAppointment,
  any,
  string
> = createSelector(
  getUpdateAppointmentErrorState,
  (state: StateUtils.LoaderState<AppointmentError>, props) => {
    return state.value.appointmentId === props.id
      ? state.value.appointmentError
      : undefined;
  }
);
