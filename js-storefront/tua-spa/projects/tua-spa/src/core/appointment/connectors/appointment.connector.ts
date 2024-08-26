// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentAdapter } from '../store/adapters';
import { Appointment } from '../..';

@Injectable({
  providedIn: 'root',
})
export class AppointmentConnector {
  constructor(protected adapter: AppointmentAdapter) {}

  /**
   * This method is used to set the appointment
   * @param appointment Create the appointment with selected timeSlot
   * @return The appointment
   */
  public setAppointment(appointment: Appointment): Observable<Appointment> {
    return this.adapter.setAppointment(appointment);
  }

  /**
   * This method is used to get the appointment
   * @param id The Appointment Id
   * @return The appointment
   */
  public getAppointmentById(id: string): Observable<Appointment> {
    return this.adapter.getAppointmentById(id);
  }

  /**
   * This method is used to update the appointment request
   * @param id The Appointment Id
   * @param appointment Update the appointment with selected timeSlot
   * @return The appointment
   */
  public updateAppointment(
    id: string,
    appointment: Appointment
  ): Observable<Appointment> {
    return this.adapter.updateAppointmentById(id, appointment);
  }
}
