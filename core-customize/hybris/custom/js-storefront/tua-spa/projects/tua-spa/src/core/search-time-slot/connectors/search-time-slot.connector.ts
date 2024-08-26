// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { SearchTimeSlot } from '../../model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchTimeSlotAdapter } from '../store/adapters';

@Injectable({
  providedIn: 'root',
})
export class SearchTimeSlotConnector {
  constructor(protected adapter: SearchTimeSlotAdapter) {}
  /**
   * This method used to get the list of available time slots
   * @param searchTimeSlot request time slot
   * @returns available time slots of {@link SearchTimeSlot}
   */
  public getTimeSlots(
    searchTimeSlot: SearchTimeSlot
  ): Observable<SearchTimeSlot> {
    return this.adapter.getTimeSlots(searchTimeSlot);
  }
}
