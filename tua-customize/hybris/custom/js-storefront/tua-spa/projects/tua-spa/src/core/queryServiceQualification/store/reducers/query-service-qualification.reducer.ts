// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { QueryServiceQualificationAction, QueryServiceQualificationTypes } from '../actions/query-service-qualification.actions';
import { Product } from '@spartacus/core';
import { QueryServiceQualificationError } from '../query-service-qualification-state';
import { QueryServiceQualification } from '../../../model';

export const serviceQualificationInitialState: QueryServiceQualification[] = [];
export const queryServiceProductSearchInitialState: Product[] = [];
export const errorInitialState: QueryServiceQualificationError[] = [];

export function queryServiceQualificationReducer(
  state = serviceQualificationInitialState,
  action: QueryServiceQualificationAction
): QueryServiceQualification[] {
  switch (action.type) {
    case QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION_SUCCESS:
      if (action.payload.isCategoryPage) {
        state = state.filter((queryServiceQualification: QueryServiceQualification) => !queryServiceQualification.isCategoryPage);
      }
      return state.concat({
        ...action.payload
      });
    case QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_QUALIFICATION_STATE:
      return serviceQualificationInitialState;
    default:
      return state;
  }
}

export function queryServiceProductSearchReducer(
  state = queryServiceProductSearchInitialState,
  action: QueryServiceQualificationAction
): Product[] {
  switch (action.type) {
    case QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT_SUCCESS: {
      if (!!action.payload) {
        action.payload.forEach(searchResult => {
          state = state.concat(searchResult.products);
        });
      }
      return state;
    }
    case QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_PRODUCT_SEARCH_RESULT: {
      return queryServiceProductSearchInitialState;
    }
    default:
      return state;
  }
}

export function queryServiceQualificationErrorReducer(
  state = errorInitialState,
  action: QueryServiceQualificationAction
): QueryServiceQualificationError[] {
  switch (action.type) {
    case QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION_FAIL: {
      if (
        !state.find(
          error => error.queryServiceQualificationId === action.payload.id
        )
      ) {
        state = state.concat({
          queryServiceQualificationError: action.payload.errorResponse,
          queryServiceQualificationId: action.payload.id
        });
      }
      return state;
    }
    case QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_QUALIFICATION_ERROR: {
      return errorInitialState;
    }
  }
  return state;
}
