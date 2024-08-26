// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { makeErrorSerializable } from '../../../config/utils/tma-serialization-utils';
import { QueryServiceQualificationTypes } from '../actions/query-service-qualification.actions';
import { QueryServiceQualificationConnector } from '../../connectors';
import { QueryServiceQualification } from '../../../model';
import { QueryServiceQualificationActions } from '../actions';
import { GlobalMessageService, GlobalMessageType, ProductSearchConnector } from '@spartacus/core';

@Injectable()
export class QueryServiceQualificationEffects {
  constructor(
    protected serviceQualificationConnector: QueryServiceQualificationConnector,
    protected queryServiceProductSearchConnector: ProductSearchConnector,
    protected globalMessageService: GlobalMessageService,
    private actions$: Actions
  ) { }

  getQueryServiceQualification$: Observable<
    | QueryServiceQualificationActions.CreateQueryServiceQualification
    | QueryServiceQualificationActions.CreateQueryServiceQualificationSuccess
    | QueryServiceQualificationActions.CreateQueryServiceQualificationFail
  > = createEffect(() => this.actions$.pipe(
    ofType(QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION),
    map(
      (
        action: QueryServiceQualificationActions.CreateQueryServiceQualification
      ) => action.payload
    ),
    concatMap((payload: { queryServiceQualification: QueryServiceQualification, isCategoryPage: boolean }) => {
      return this.serviceQualificationConnector
        .createQueryServiceQualification(payload.queryServiceQualification)
        .pipe(
          map(
            (serviceQualification: QueryServiceQualification) => {
              serviceQualification.address = payload.queryServiceQualification.searchCriteria.service.place;
              if (payload.isCategoryPage) {
                serviceQualification.isCategoryPage = payload.isCategoryPage;
              }
              return new QueryServiceQualificationActions.CreateQueryServiceQualificationSuccess(
                serviceQualification
              )
            }
          ),
          catchError((error: any) => {
              this.globalMessageService.add(
                error.error.message,
                GlobalMessageType.MSG_TYPE_ERROR
              );
              return of(
                new QueryServiceQualificationActions.CreateQueryServiceQualificationFail(
                  {
                    errorResponse: makeErrorSerializable(error)
                  }
                )
              )}
          )
        );
    })
  )
  );

  queryServiceSearchProducts$: Observable<
    | QueryServiceQualificationActions.QueryServiceProductSearchResult
    | QueryServiceQualificationActions.QueryServiceProductSearchResultSuccess
    | QueryServiceQualificationActions.QueryServiceProductSearchResultFail
  > = createEffect(() => this.actions$.pipe(
    ofType(QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT),
    map(
      (
        action: QueryServiceQualificationActions.QueryServiceProductSearchResult
      ) => action.payload
    ),
    concatMap(payload => {
      const queryResult = [];
      payload.queryText.forEach((query: string) => {
        queryResult.push(
          this.queryServiceProductSearchConnector.search(query)
            .pipe(
              catchError(error =>
                of(
                  new QueryServiceQualificationActions.QueryServiceProductSearchResultFail(
                    makeErrorSerializable(error)
                  )
                )
              )
            )
        );
      });
      return forkJoin(queryResult).pipe(
        map(searchResult => {
          return new QueryServiceQualificationActions.QueryServiceProductSearchResultSuccess(
            searchResult
          );
        }),
        catchError(error =>
          of(
            new QueryServiceQualificationActions.QueryServiceProductSearchResultFail(
              makeErrorSerializable(error)
            )
          )
        )
      );
    })
  )
  );
}
