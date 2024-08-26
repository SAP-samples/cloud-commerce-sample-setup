// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, mergeMap } from 'rxjs/operators';
import { TmaTmfCartActionTypes } from '../actions/tma-tmf-cart.action';
import { TmaTmfCartAction } from '../actions';
import { OCC_USER_ID_ANONYMOUS } from '@spartacus/core';
import { TmaTmfCartConnector } from '../../connectors';
import { CartActions } from '@spartacus/cart/base/core';

@Injectable()
export class TmaTmfCartEffect {

  constructor(
    protected actions$: Actions,
    protected tmaCartConnector: TmaTmfCartConnector
  ) {
  }

  updateCart$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(TmaTmfCartActionTypes.UPDATE_CART),
      map((action: TmaTmfCartAction.UpdateCart) => action.payload),
      mergeMap((payload: any) => {
        return this.tmaCartConnector.updateCart(payload.shoppingCart).pipe(
          map(_ => {
            return new CartActions.LoadCart({
              userId: payload.shoppingCart.relatedParty[0].id,
              cartId: payload.shoppingCart.relatedParty[0].id === OCC_USER_ID_ANONYMOUS ? payload.shoppingCart.guid : payload.shoppingCart.id
            });
          })
        );
      })
    )
  );
}
