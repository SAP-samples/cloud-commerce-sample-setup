// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { SearchTimeSlotConnector } from '../../connectors';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import * as SearchTimeSlotActions from '../actions/search-time-slot.action';
import { SearchTimeSlotActionTypes } from '../actions/search-time-slot.action';
import { SearchTimeSlot } from '../../../model';
import { SearchTimeSlotAction } from '../actions';

@Injectable()
export class SearchTimeSlotEffect {
  constructor(
    protected actions$: Actions,
    protected searchTimeSlotConnector: SearchTimeSlotConnector
  ) {}

  loadSearchTimeSlotss$: Observable<
    | SearchTimeSlotActions.LoadSearchTimeSlotSuccess
    | SearchTimeSlotActions.LoadSearchTimeSlotFail
  > = createEffect(() => this.actions$.pipe(
    ofType(SearchTimeSlotActionTypes.LOAD_SEARCH_TIME_SLOT),
    map((action: SearchTimeSlotAction.LoadSearchTimeSlot) => action.payload),
    concatMap((payload: any) => {
      return this.searchTimeSlotConnector
        .getTimeSlots(payload.requestedTimeSlot)
        .pipe(
          map(
            (searchTimeSlots: SearchTimeSlot) =>
              new SearchTimeSlotActions.LoadSearchTimeSlotSuccess(
                searchTimeSlots
              )
          ),
          catchError((error: any) =>
            of(
              new SearchTimeSlotActions.LoadSearchTimeSlotFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  )
  );
}
