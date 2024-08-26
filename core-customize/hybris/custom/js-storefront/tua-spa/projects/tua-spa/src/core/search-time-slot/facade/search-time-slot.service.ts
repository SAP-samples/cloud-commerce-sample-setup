// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import * as SearchTimeSlotActions from '../store/actions/search-time-slot.action';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchTimeSlot, TimeSlot } from '../../model';
import { select, Store } from '@ngrx/store';
import * as SearchTimeSlotSelectors from '../store/selectors/search-time-slot.selector';
import { StateWithSearchTimeSlot } from '../store';
import { JourneyChecklistConfig } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class SearchTimeSlotService {
  constructor(
    protected store: Store<StateWithSearchTimeSlot>,
    protected config?: JourneyChecklistConfig
  ) {
  }

  /**
   * Returns the available time slot for the requested date.
   *
   * @param requestedDate
   *           The date used to retrieve the available time slots
   * @returns Observable<SearchTimeSlot>
   *                the available time slots
   */
  getAvailableSearchTimeSlot(
    requestedDate?: Date
  ): Observable<SearchTimeSlot> {
    this.loadSearchTimeSlot(requestedDate);
    return this.store.pipe(
      select(SearchTimeSlotSelectors.getAllSearchTimeSlots)
    );
  }

  /**
   * Loads the available time slots for the requested date
   *
   * @param requestedStartDate
   *            The start date used to search the time slot
   * @param requestedEndDate
   *            The end date used to search the time slot
   */
  loadSearchTimeSlot(requestedStartDate: Date, requestedEndDate?: Date): void {
    const startDate = new Date(requestedStartDate);
    const endDate = requestedEndDate ? new Date(requestedEndDate) : startDate;

    const searchTimeSlotRequest: SearchTimeSlot = {
      requestedTimeSlot: [
        {
          validFor: {
            startDateTime: startDate,
            endDateTime: endDate
          }
        }
      ]
    };
    this.store.dispatch(
      new SearchTimeSlotActions.LoadSearchTimeSlot({
        requestedTimeSlot: searchTimeSlotRequest
      })
    );
  }

  /**
   * Sets the selected time slot.
   *
   * @param  timeSlot The selected time slot of {@link TimeSlot}
   */
  setSelectedTimeSlot(timeSlot: TimeSlot): void {
    if (!!timeSlot) {
      this.store.dispatch(
        new SearchTimeSlotActions.SelectedTimeSlotSucess({
          requestedTimeSlot: timeSlot
        })
      );
    }
  }

  /**
   * Gets the selected time slot
   *
   * @returns Observable<SearchTimeSlot>
   *                The selected time slot
   */
  getSelectedTimeSlot(): Observable<SearchTimeSlot> {
    return this.store.select(SearchTimeSlotSelectors.getSelectedTimeSlots);
  }

  /**
   * Gets the error occurred during fetching of time slots
   *
   * @returns Observable<string>
   *                The search time slot error
   */
  getSearchTimeSlotError(): Observable<string> {
    return this.store.select(SearchTimeSlotSelectors.getSearchTimeSlotError);
  }

  /**
   * Clears the search time slot state.
   */
  clearSearchTimeSlotState(): void {
    this.store.dispatch(new SearchTimeSlotActions.ClearSearchTimeSlotState());
  }

  /**
   * Clears the search time slot error state.
   */
  clearSearchTimeSlotErrorState(): void {
    this.store.dispatch(
      new SearchTimeSlotActions.ClearSearchTimeSlotErrorState()
    );
  }

  /**
   * Clears the selected search time slot state.
   */
  clearSelectedSearchTimeSlotState(): void {
    this.store.dispatch(
      new SearchTimeSlotActions.ClearSelectedSearchTimeSlotState()
    );
  }
}
