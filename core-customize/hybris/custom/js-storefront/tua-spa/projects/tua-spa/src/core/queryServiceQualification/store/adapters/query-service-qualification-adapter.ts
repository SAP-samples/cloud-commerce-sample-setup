// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Observable } from 'rxjs';
import { QueryServiceQualification } from '../../../model';

export abstract class QueryServiceQualificationAdapter {
  /**
   * The method consumes QueryServiceQualification with search criteria and returns the
   * QueryServiceQualification with the list of services available against the given search criteria,
   * if no services are available then it returns the QueryServiceQualification with empty list of services.
   *
   * @param searchCriteria  QueryServiceQualification with search criteria ,i.e, the geographical address
   *
   * @return {@link QueryServiceQualification} as an {@link Observable}
   */
  abstract createQueryServiceQualification(searchCriteria: QueryServiceQualification): Observable<QueryServiceQualification>;
}
