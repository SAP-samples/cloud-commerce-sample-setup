// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Appointment } from '../../model';
import { StateUtils } from '@spartacus/core';

export const APPOINTMENT_FEATURE = 'appointment';
export const APPOINTMENT_DATA = '[Appointment] Appointment Data';

export interface StateWithAppointment {
  [APPOINTMENT_FEATURE]: AppointmentState;
}

export interface AppointmentState {
  appointments?: StateUtils.LoaderState<Appointment[]>;
  newAppointment?: StateUtils.LoaderState<Appointment>;
  error?: StateUtils.LoaderState<AppointmentError[]>;
  updateAppointmentError?: StateUtils.LoaderState<AppointmentError>;
}

export interface AppointmentError {
  appointmentId?: string;
  appointmentError?: string;
}
