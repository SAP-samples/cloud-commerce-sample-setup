// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Product } from '@spartacus/core';
import { QueryServiceQualification } from '../../model';

export const QUERY_SERVICE_QUALIFICATION_FEATURE = 'Service-Qualification';
export const QUERY_SERVICE_QUALIFICATION_DATA = '[QueryServiceQualification] QueryServiceQualification Data';

export interface StateWithQueryServiceQualification {
  [QUERY_SERVICE_QUALIFICATION_FEATURE]: QueryServiceQualificationState;
}

export interface QueryServiceQualificationState {
  queryServiceQualification?: QueryServiceQualification[];
  searchProductResult?: Product[];
  error?: QueryServiceQualificationError[];
}

export interface QueryServiceQualificationError {
  queryServiceQualificationId?: string;
  queryServiceQualificationError?: string;
}
