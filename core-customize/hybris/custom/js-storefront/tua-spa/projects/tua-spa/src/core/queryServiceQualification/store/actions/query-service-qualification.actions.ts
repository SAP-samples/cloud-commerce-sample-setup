// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { StateUtils } from '@spartacus/core';
import { QUERY_SERVICE_QUALIFICATION_DATA } from '../query-service-qualification-state';
import { QueryServiceQualification } from '../../../model';

export enum QueryServiceQualificationTypes {
  CREATE_QUERY_SERVICE_QUALIFICATION = '[QueryServiceQualification] Create QueryServiceQualification',
  CREATE_QUERY_SERVICE_QUALIFICATION_SUCCESS = '[QueryServiceQualification] Create QueryServiceQualification Success',
  CREATE_QUERY_SERVICE_QUALIFICATION_FAIL = '[QueryServiceQualification] Create QueryServiceQualification Fail',
  CLEAR_QUERY_SERVICE_QUALIFICATION_STATE = '[QueryServiceQualification] Clear QueryServiceQualification State',
  CLEAR_QUERY_SERVICE_QUALIFICATION_ERROR = '[QueryServiceQualification] Clear QueryServiceQualification Error',
  QUERY_SERVICE_PRODUCT_SEARCH_RESULT = '[QueryServiceQualification] Search Product result based on query qualification',
  QUERY_SERVICE_PRODUCT_SEARCH_RESULT_SUCCESS = '[QueryServiceQualification] Search Product result based on query qualification Success',
  QUERY_SERVICE_PRODUCT_SEARCH_RESULT_FAIL = '[QueryServiceQualification] Search Product result based on query qualification Fail',
  CLEAR_QUERY_SERVICE_PRODUCT_SEARCH_RESULT = '[QueryServiceQualification] Clear Search Product result based on query qualification'
}

export class CreateQueryServiceQualification extends StateUtils.LoaderLoadAction {
  readonly type =
    QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION;
  constructor(public payload: { queryServiceQualification: QueryServiceQualification, isCategoryPage: boolean }) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class CreateQueryServiceQualificationSuccess extends StateUtils.LoaderSuccessAction {
  readonly type =
    QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION_SUCCESS;
  constructor(public payload: any) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class CreateQueryServiceQualificationFail extends StateUtils.LoaderFailAction {
  readonly type =
    QueryServiceQualificationTypes.CREATE_QUERY_SERVICE_QUALIFICATION_FAIL;
  constructor(public payload: any) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class QueryServiceProductSearchResult extends StateUtils.LoaderLoadAction {
  readonly type =
    QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT;
  constructor(public payload: any) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class QueryServiceProductSearchResultSuccess extends StateUtils.LoaderLoadAction {
  readonly type =
    QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT_SUCCESS;
  constructor(public payload: any) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class QueryServiceProductSearchResultFail extends StateUtils.LoaderLoadAction {
  readonly type =
    QueryServiceQualificationTypes.QUERY_SERVICE_PRODUCT_SEARCH_RESULT_FAIL;
  constructor(public payload: any) {
    super(QUERY_SERVICE_QUALIFICATION_DATA);
  }
}

export class ClearQueryServiceProductSearchResult {
  readonly type =
    QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_PRODUCT_SEARCH_RESULT;
  constructor() {
  }
}

export class ClearQueryServiceQualification {
  readonly type =
    QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_QUALIFICATION_STATE;
  constructor() {
  }
}

export class ClearQueryServiceQualificationError {
  readonly type =
    QueryServiceQualificationTypes.CLEAR_QUERY_SERVICE_QUALIFICATION_ERROR;
  constructor() {
  }
}

export type QueryServiceQualificationAction =
  | CreateQueryServiceQualification
  | CreateQueryServiceQualificationSuccess
  | CreateQueryServiceQualificationFail
  | QueryServiceProductSearchResult
  | QueryServiceProductSearchResultSuccess
  | QueryServiceProductSearchResultFail
  | ClearQueryServiceQualification
  | ClearQueryServiceQualificationError
  | ClearQueryServiceProductSearchResult;
