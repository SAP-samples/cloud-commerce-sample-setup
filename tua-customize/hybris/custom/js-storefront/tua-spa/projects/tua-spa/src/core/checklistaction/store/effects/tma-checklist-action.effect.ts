// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TmaChecklistActions from '../actions/tma-checklist-action.action';
import { TmaChecklistActionTypes } from '../actions/tma-checklist-action.action';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { TmaChecklistActionConnector } from '../../connectors';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaChecklistAction } from '../../../model';
import { Action } from '@ngrx/store';

@Injectable()
export class TmaChecklistActionEffect {
  constructor(
    protected actions$: Actions,
    protected tmaChecklistActionConnector: TmaChecklistActionConnector
  ) {}

  loadChecklistAction$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(TmaChecklistActionTypes.LOAD_CHECKLIST_ACTIONS),
    map((action: TmaChecklistActions.LoadChecklistActions) => action.payload),
    mergeMap((payload: any) => {
      if (payload.productCode) {
        return this.tmaChecklistActionConnector
          .getChecklistActions(
            payload.baseSiteId,
            payload.productCode,
            payload.processType
          )
          .pipe(
            map((checklistActions: TmaChecklistAction[]) => {
              return new TmaChecklistActions.LoadChecklistActionsSuccess({
                checklistActions: checklistActions,
                productCode: payload.productCode,
                baseSiteId: payload.baseSiteId,
                processType: payload.processType,
                isDependentProduct: payload.isDependentProduct,
                isInstallationAddressSelected: payload.isInstallationAddressSelected
              });
            }),
            catchError((error: any) =>
              of(
                new TmaChecklistActions.LoadChecklistActionsFail(
                  makeErrorSerializable(error)
                )
              )
            )
          );
      }
      return this.tmaChecklistActionConnector
        .getChecklistActionsFor(
          payload.baseSiteId,
          payload.productOfferingCodes,
          payload.processType
        )
        .pipe(
          map((checklistActions: TmaChecklistAction[]) => {
            return new TmaChecklistActions.LoadChecklistActionsSuccess({
              checklistActions: checklistActions,
              productOfferingCodes: payload.productOfferingCodes,
              baseSiteId: payload.baseSiteId,
              processType: payload.processType,
            });
          }),
          catchError((error: any) =>
            of(
              new TmaChecklistActions.LoadChecklistActionsFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  )
  );
}
