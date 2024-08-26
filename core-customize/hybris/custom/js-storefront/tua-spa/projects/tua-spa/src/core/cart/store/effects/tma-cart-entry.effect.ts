// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoggerService, normalizeHttpError, SiteContextActions, withdrawOn } from '@spartacus/core';
import { from, Observable } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaCartEntryConnector } from '../../connectors';
import * as TmaCartEntryActions from '../actions/tma-cart-entry.action';
import { TmaCartEntryActionTypes } from '../actions/tma-cart-entry.action';
import { CartModification } from '@spartacus/cart/base/root';
import { CartActions } from '@spartacus/cart/base/core';
import { TmaCartActions } from '../actions';

@Injectable()
export class TmaCartEntryEffects {
  protected logger = inject(LoggerService);

  constructor(
    private tmaActions$: Actions,
    private tmaCartEntryConnector: TmaCartEntryConnector
  ) {
  }

  private tmaContextChange$ = this.tmaActions$.pipe(
    ofType(
      SiteContextActions.CURRENCY_CHANGE,
      SiteContextActions.LANGUAGE_CHANGE
    )
  );

  addCartEntry$: Observable<
    | CartActions.CartAddEntrySuccess
    | CartActions.CartAddEntryFail
    | TmaCartActions.LoadCart
    > = createEffect(() => this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.ADD_ENTRY),
    map((action: TmaCartEntryActions.AddEntry) => action.payload),
    concatMap(payload => {
      return this.tmaCartEntryConnector
        .addCartEntry(
          payload.userId,
          payload.cartId,
          payload.cartEntry
        )
        .pipe(
          map(
            (cartModification: CartModification) =>
              new CartActions.CartAddEntrySuccess({
                ...payload,
                ...(cartModification)
              })
          ),
          catchError((error) =>
            from([
              new CartActions.CartAddEntryFail({
                ...payload,
                error: makeErrorSerializable(error)
              }),
              new TmaCartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId
              })
            ])
          )
        );
    }),
    withdrawOn(this.tmaContextChange$)
  )
  );

  updateCartEntry$: Observable<
    | CartActions.CartUpdateEntrySuccess
    | CartActions.CartUpdateEntryFail
    | TmaCartActions.LoadCart
    > = createEffect(() => this.tmaActions$.pipe(
    ofType(TmaCartEntryActionTypes.UPDATE_ENTRY),
    map((action: TmaCartEntryActions.UpdateEntry) => action.payload),
    concatMap(payload =>
      this.tmaCartEntryConnector
        .updateCartEntry(payload.userId, payload.cartId, payload.cartEntry)
        .pipe(
          map(() => {
            return new CartActions.CartUpdateEntrySuccess({
              ...payload
            });
          }),
          catchError((error) =>
            from([
              new CartActions.CartUpdateEntryFail({
                ...payload,
                error: makeErrorSerializable(error)
              }),
              new TmaCartActions.LoadCart({
                cartId: payload.cartId,
                userId: payload.userId
              })
            ])
          )
        )
    ),
    withdrawOn(this.tmaContextChange$)
  )
  );

  removeEntryForAnonymous$: Observable<
    | CartActions.CartRemoveEntrySuccess
    | CartActions.CartRemoveEntryFail
    | TmaCartActions.LoadCart
  > = createEffect(() =>
    this.tmaActions$.pipe(
      ofType(TmaCartEntryActionTypes.CART_REMOVE_ENTRY_ANONYMOUS),
      map((action: TmaCartEntryActions.CartRemoveEntry) => action.payload),
      concatMap((payload) =>
        this.tmaCartEntryConnector
          .remove(payload.userId, payload.guid, payload.entryNumber)
          .pipe(
            map(() => {
              return new CartActions.CartRemoveEntrySuccess({
                ...payload,
              });
            }),
            catchError((error) =>
              from([
                new CartActions.CartRemoveEntryFail({
                  ...payload,
                  error: normalizeHttpError(error, this.logger),
                }),
                new TmaCartActions.LoadCart({
                  cartId: payload.cartId,
                  userId: payload.userId,
                }),
              ])
            )
          )
      ),
      withdrawOn(this.tmaContextChange$)
    )
  );
}
