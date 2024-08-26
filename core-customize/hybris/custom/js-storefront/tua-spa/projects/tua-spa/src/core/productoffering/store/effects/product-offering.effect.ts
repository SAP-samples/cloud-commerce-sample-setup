// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { TmaProduct } from '../../../model';
import { ProductOfferingConnector } from '../../connectors/product-offering.connector';
import { ProductOfferingActions } from '../actions';
import { ProductOfferingActionTypes } from '../actions/product-offering.actions';

@Injectable()
export class ProductOfferingEffect {
  constructor(
    protected actions$: Actions,
    protected productOfferingConnector: ProductOfferingConnector
  ) {}

  getProductOffering$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(ProductOfferingActionTypes.LOAD_PRODUCT_OFFERING),
    map(
      (action: ProductOfferingActions.LoadProductOffering) => action.payload
    ),
    concatMap((payload: any) => {
      return this.productOfferingConnector
        .getProductOffering(
          payload.baseSiteId,
          payload.productOfferingId,
          payload.processType
        )
        .pipe(
          map(
            (tmaProducts: TmaProduct[]) =>
              new ProductOfferingActions.LoadProductOfferingSuccess({
                productOffering: tmaProducts[0],
                processType: payload.processType
              })
          ),
          catchError((error: any) =>
            of(
              new ProductOfferingActions.LoadProductOfferingFail({
                errorResponse: makeErrorSerializable(error)
              })
            )
          )
        );
    })
  )
  );
}
