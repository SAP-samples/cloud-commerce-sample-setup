// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { ReservationState } from '../reservation.state';
import { InjectionToken, Provider } from '@angular/core';
import {
  createReservationReducer,
  reservationErrorReducer,
  reservationReducer,
  updateReservationErrorReducer
} from './reservation.reducer';

export function getReducers(): ActionReducerMap<ReservationState> {
  return {
    reservations: reservationReducer,
    newReservation: createReservationReducer,
    reservationErrors: reservationErrorReducer,
    updateReservationError: updateReservationErrorReducer,
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<
  ReservationState
>> = new InjectionToken<ActionReducerMap<ReservationState>>(
  'ReservationReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers,
};

export const metaReducers: MetaReducer<any>[] = [];
