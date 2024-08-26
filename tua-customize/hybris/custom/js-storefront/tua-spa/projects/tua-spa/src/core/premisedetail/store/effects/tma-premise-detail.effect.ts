// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaTechnicalResource } from '../../../model';
import { TmaPremiseDetailConnector } from '../../connectors/tma-premise-detail.connector';
import * as TmaPremiseDetailAction from '../actions/tma-premise-detail.actions';
import { TmaPremiseDetailActionTypes } from '../actions/tma-premise-detail.actions';

@Injectable()
export class TmaPremiseDetailEffect {

  constructor(
    protected actions$: Actions,
    protected tmaPremiseDetailConnector: TmaPremiseDetailConnector
  ) {
  }

  /**
   * Effect for the premise details related actions
   */
  validatePremiseDetail$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(TmaPremiseDetailActionTypes.VALIDATE_PREMISE_DETAIL),
    map((action: TmaPremiseDetailAction.ValidatePremiseDetail) => action.payload),
    mergeMap(payload => {
        return this.tmaPremiseDetailConnector.validatePremiseDetails(payload.premiseDetail)
        .pipe(
          map((technicalResources: TmaTechnicalResource[]) => {
            return new TmaPremiseDetailAction.ValidatePremiseDetailSuccess({
              premiseDetail: payload.premiseDetail,
              technicalResources: technicalResources
            });
          }),
          catchError(error =>
            of(
              new TmaPremiseDetailAction.ValidatePremiseDetailFail({
                premiseDetail: payload.premiseDetail,
                error: makeErrorSerializable(error)
              })
            ))
        );
      }
    )
  )
  );
}
