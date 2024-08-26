// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { Appointment } from '../../..';

export abstract class AppointmentAdapter {
  /**
   * Abstract method used to set the appointment
   * @param appointment The appointment request
   * @return The Appointment
   */
  abstract setAppointment(appointment: Appointment): Observable<Appointment>;

  /**
   * Abstract method used to get the appointment
   * @param id The Appointment Id
   * @return The Appointment
   */
  abstract getAppointmentById(id: string): Observable<Appointment>;

  /**
   * Abstract method used to update the appointment request
   * @param id The Appointment Id
   * @param appointment The appointment to update
   * @return The Appointment
   */
  abstract updateAppointmentById(
    id: string,
    appointment: Appointment
  ): Observable<Appointment>;
}
