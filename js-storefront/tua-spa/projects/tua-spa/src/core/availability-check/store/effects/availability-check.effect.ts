// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import * as AvailabilityCheckActions from '../actions/availability-check.action';
import { AvailabilityCheckActionTypes } from '../actions/availability-check.action';
import { AvailabilityCheckConnector } from '../../connectors';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { AppliedCapacityAmount } from '../../../model';

@Injectable()
export class AvailabilityCheckEffect {
  constructor(
    protected actions$: Actions,
    protected availabilityCheckConnector: AvailabilityCheckConnector
  ) {
  }

  loadResourceCheckAvailability$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(AvailabilityCheckActionTypes.LOAD_AVAILABILITY_CHECK),
    map(
      (action: AvailabilityCheckActions.LoadAvailabilityCheck) => action.payload
    ),
    mergeMap((payload: any) => {
      return this.availabilityCheckConnector.getLogicalResources(payload).pipe(
        map((appliedCapacityAmount: AppliedCapacityAmount) => {
          return new AvailabilityCheckActions.LoadAvailabilityCheckSuccess({
            appliedCapacityAmount: appliedCapacityAmount
          });
        }),
        catchError((error: any) =>
          of(
            new AvailabilityCheckActions.LoadAvailabilityCheckFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  )
  );
}
