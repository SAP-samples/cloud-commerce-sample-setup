// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import * as SubscriptionBaseDetailActions from '../actions/subscription-base-details.action';
import { SubscriptionBaseDetailsActionType } from '../actions/subscription-base-details.action';
import { SubscriptionBaseDetailsConnector } from '../../connectors';
import { SubscriptionBaseDetail } from '../../../../model';

@Injectable()
export class SubscriptionBaseDetailsEffect {
  constructor(
    protected actions$: Actions,
    protected tmaSubscriptionBaseDetailConnector: SubscriptionBaseDetailsConnector
  ) {}

  loadSubscriptionDetails$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(SubscriptionBaseDetailsActionType.LOAD_SUBSCRIPTION_BASE_DETAILS),
    map(
      (action: SubscriptionBaseDetailActions.LoadSubscriptionBaseDetails) =>
        action.payload
    ),
    mergeMap((payload) => {
      return this.tmaSubscriptionBaseDetailConnector
        .getSubscriptionDetails(payload.baseSiteId, payload.subscriptionBaseId)
        .pipe(
          map((subscriptionDetails: SubscriptionBaseDetail[]) => {
            return new SubscriptionBaseDetailActions.LoadSubscriptionBaseDetailsSuccess(
              {
                subscriptionBaseDetail: subscriptionDetails,
                subscriptionBaseId: payload.subscriptionBaseId,
                baseSiteId: payload.baseSiteId,
              }
            );
          }),
          catchError((error: any) =>
            of(
              new SubscriptionBaseDetailActions.LoadSubscriptionBaseDetailsFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  )
  );
}
