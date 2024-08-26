// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../../config/utils/tma-serialization-utils';
import { Action } from '@ngrx/store';
import * as TmfProductActions from '../actions/tmf-product.action';
import { TmfProductActionType } from '../actions/tmf-product.action';
import { TmfProductConnector } from '../../connectors';
import { TmfProduct, TmfProductRelationship } from '../../../../model';

@Injectable()
export class TmfProductEffect {
  constructor(
    protected actions$: Actions,
    protected tmfProductConnector: TmfProductConnector
  ) {}

  loadSubscribedProduct$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(TmfProductActionType.LOAD_TMF_PRODUCT),
    map((action: TmfProductActions.LoadTmfProduct) => action.payload),
    mergeMap((payload) => {
      return this.tmfProductConnector
        .getTmfProductDetails(payload.baseSiteId, payload.tmfProductId)
        .pipe(
          map((tmfProduct: TmfProduct) => {
            if(tmfProduct.productRelationship)
            {
              return new TmfProductActions.LoadTmfProducts({
                tmfProduct: tmfProduct,
                tmfProductId: payload.tmfProductId,
                baseSiteId: payload.baseSiteId
              });
            }
            else
            {
              return new TmfProductActions.LoadTmfProductSuccess({
                tmfProduct: tmfProduct,
                tmfProductId: payload.tmfProductId,
                baseSiteId: payload.baseSiteId
              });
            }
          }),
          catchError((error: any) =>
            of(
              new TmfProductActions.LoadTmfProductFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  )
  );

  loadSubscribedProducts$: Observable<Action> = createEffect(() => this.actions$.pipe(
    ofType(TmfProductActionType.LOAD_TMF_PRODUCTS),
    map((action: TmfProductActions.LoadTmfProduct) => action.payload),
    concatMap((payload) => {
      const result=[];
          payload.tmfProduct.productRelationship.forEach((tmfRelation: TmfProductRelationship)=>{
            result.push(this.tmfProductConnector
              .getTmfProductDetails(payload.baseSiteId, tmfRelation.product.id));
          });
         return  forkJoin(...result)
            .pipe(
          map((tmfProducts: TmfProduct[]) => {
            return new TmfProductActions.LoadTmfProductsSuccess({
              tmfProduct: payload.tmfProduct,
              tmfProductId: payload.tmfProductId,
              tmfProducts: tmfProducts,
              baseSiteId: payload.baseSiteId
            });
          }),
          catchError((error: any) =>
            of(
              new TmfProductActions.LoadTmfProductFail(
                makeErrorSerializable(error)
              )
            )
          )
        );
    })
  )
  );
}
