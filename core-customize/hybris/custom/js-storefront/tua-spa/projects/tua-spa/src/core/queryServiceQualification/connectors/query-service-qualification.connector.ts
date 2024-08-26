// Copyright (c) 2023 SAP SE or an SAP affiliate company. All rights reserved

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryServiceQualificationAdapter } from '../store';
import { QueryServiceQualification } from '../../model';

@Injectable({
  providedIn: 'root'
})
export class QueryServiceQualificationConnector {
  constructor(protected adapter: QueryServiceQualificationAdapter) {}

/**
 * The method consumes QueryServiceQualification with search criteria and returns the
 * QueryServiceQualification with the list of services available against the given search criteria,
 * if no services are available then it returns the QueryServiceQualification with empty list of services.
 *
 * @param searchCriteria  QueryServiceQualification with search criteria ,i.e, the geographical address
 *
 * @return a {@link QueryServiceQualification} as an {@link Observable}
 */
  public createQueryServiceQualification(
    searchCriteria: QueryServiceQualification
  ): Observable<QueryServiceQualification> {
    return this.adapter.createQueryServiceQualification(searchCriteria);
  }
}
