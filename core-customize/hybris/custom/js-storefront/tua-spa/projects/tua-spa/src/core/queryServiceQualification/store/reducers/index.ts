// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { QueryServiceQualificationState } from '../query-service-qualification-state';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { InjectionToken, Provider } from '@angular/core';
import {
  queryServiceProductSearchReducer,
  queryServiceQualificationErrorReducer,
  queryServiceQualificationReducer
} from './query-service-qualification.reducer';

export function getReducers(): ActionReducerMap<QueryServiceQualificationState> {
  return {
    queryServiceQualification: queryServiceQualificationReducer,
    error: queryServiceQualificationErrorReducer,
    searchProductResult: queryServiceProductSearchReducer
  };
}

export const reducerToken: InjectionToken<ActionReducerMap<QueryServiceQualificationState>
> = new InjectionToken<ActionReducerMap<QueryServiceQualificationState>>(
  'queryServiceQualificationReducer'
);

export const reducerProvider: Provider = {
  provide: reducerToken,
  useFactory: getReducers
};

export const metaReducers: MetaReducer<any>[] = [];
